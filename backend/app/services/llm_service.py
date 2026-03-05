from openai import OpenAI
import os
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# ==============================
# CONFIG
# ==============================
MODEL_NAME = "arcee-ai/trinity-large-preview:free" # Or your preferred model
CHUNK_SIZE = 12000
CHUNK_OVERLAP = 1500
MAX_RETRIES = 3
MAX_THREADS = 7 # Number of chunks to process in parallel

# ==============================
# TEXT CHUNKER
# ==============================
def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

# ==============================
# OPENROUTER CALL WITH RETRY
# ==============================
def call_with_retry(client, payload):
    delay = 2
    for attempt in range(MAX_RETRIES):
        try:
            return client.chat.completions.create(**payload)
        except Exception as e:
            if "429" in str(e):
                print(f"⚠ Rate limited. Retrying in {delay}s...")
                time.sleep(delay)
                delay *= 2
            else:
                raise e
    raise Exception("Max retries exceeded.")

# ==============================
# SINGLE CHUNK EXTRACTION
# ==============================
def extract_chunk_rules(client, chunk_text):
    
    # 1. NEW HIGH-FIDELITY PROMPT
    system_prompt = """
    You are a Senior Classification Society Surveyor (IRClass).
    Your task is to extract mathematically precise design rules from the text provided.
    
    **OUTPUT FORMAT RULES:**
    1. Output MUST be valid JSON with a 'rules' key.
    2. 'left_param': The variable being constrained (e.g., 't_plate', 'Z_modulus', 'x_bulkhead').
    3. 'condition': One of [ >=, <=, ==, >, < ].
    4. 'right_param': The math formula. Use Python syntax (e.g., '0.05 * LBP', 'sqrt(T)').
    5. 'category': Infer from context (e.g., 'Hull Structure', 'Piping', 'Safety').
    """

    user_prompt = f"""
    Analyze this text from the IRClass Rulebook and extract all constraints.

    **EXAMPLES OF HOW TO EXTRACT:**
    
    Text: "The collision bulkhead shall be located between 0.05L and 0.08L from the FP."
    Output:
    {{
      "rules": [
        {{ "parameter_name": "Collision Bulkhead Min Pos", "left_param": "x_col_bhd", "condition": ">=", "right_param": "0.05 * LBP", "description": "Min distance from FP", "category": "Hull" }},
        {{ "parameter_name": "Collision Bulkhead Max Pos", "left_param": "x_col_bhd", "condition": "<=", "right_param": "0.08 * LBP", "description": "Max distance from FP", "category": "Hull" }}
      ]
    }}

    Text: "The thickness of the shell plating is not to be less than (0.04L + 5) mm."
    Output:
    {{
      "rules": [
        {{ "parameter_name": "Shell Plating Thickness", "left_param": "t_shell", "condition": ">=", "right_param": "0.04 * LBP + 5", "description": "Minimum shell plating thickness", "category": "Structure" }}
      ]
    }}

    **TEXT TO ANALYZE:**
    {chunk_text}

    **RETURN JSON:**
    """

    payload = {
        "model": MODEL_NAME,
        "temperature": 0.0, # Zero temp for maximum precision
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "response_format": {"type": "json_object"},
    }

    completion = call_with_retry(client, payload)
    
    raw_content = completion.choices[0].message.content
    clean_text = raw_content.strip()

    # Robust cleaning
    if clean_text.startswith("```json"): clean_text = clean_text[7:]
    if clean_text.startswith("```"): clean_text = clean_text[3:]
    if clean_text.endswith("```"): clean_text = clean_text[:-3]
    clean_text = clean_text.strip()
    
    # Extract JSON block safely
    start = clean_text.find("{")
    end = clean_text.rfind("}")
    if start != -1 and end != -1:
        clean_text = clean_text[start:end+1]

    try:
        data = json.loads(clean_text)
        return data.get("rules", [])
    except json.JSONDecodeError:
        print(f"   ⚠️ Chunk JSON Error. Raw: {clean_text[:50]}...")
        return []

# ==============================
# MAIN EXTRACTION PIPELINE
# ==============================
def extract_rules_with_llm(raw_text):

    print("\n--- 🚀 Starting IRClass Document Extraction (Parallel) ---")

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "OPENROUTER_API_KEY is missing", "status": 500}

    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        # 1️⃣ Split into chunks
        chunks = chunk_text(raw_text)
        print(f"📄 Document split into {len(chunks)} chunks.")

        all_rules = []

        # 2️⃣ PARALLEL PROCESSING WITH THREADS
        print(f"🔹 Starting parallel processing with {MAX_THREADS} threads...")
        with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
            # Create a dictionary to map future to chunk index for logging
            future_to_chunk = {executor.submit(extract_chunk_rules, client, chunk): i for i, chunk in enumerate(chunks)}
            
            for i, future in enumerate(as_completed(future_to_chunk)):
                chunk_index = future_to_chunk[future]
                try:
                    chunk_rules = future.result()
                    print(f"   ✓ Chunk {chunk_index + 1}/{len(chunks)} processed, found {len(chunk_rules)} rules.")
                    all_rules.extend(chunk_rules)
                except Exception as exc:
                    print(f"   ❌ Chunk {chunk_index + 1} generated an exception: {exc}")

        print(f"\n📊 Total Raw Rules Extracted: {len(all_rules)}")

        # 3️⃣ Clean and Deduplicate
        filtered_rules = [
            r for r in all_rules
            if r.get("parameter_name") and r.get("condition") and r.get("right_param")
        ]
        
        unique_rules = {}
        for r in filtered_rules:
            # Create a unique key based on the rule's core logic
            key = (r["parameter_name"], r["condition"], r["right_param"])
            unique_rules[key] = r

        final_rules = list(unique_rules.values())

        print(f"🧹 Final Unique Rules after cleaning: {len(final_rules)}")

        return {
            "success": True,
            "data": final_rules
        }

    except Exception as e:
        print(f"❌ Main Extraction Pipeline Error: {str(e)}")
        return {"error": str(e), "status": 500}