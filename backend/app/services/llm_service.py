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
MAX_THREADS = 2 # Number of chunks to process in parallel

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
    
    # 1. NEW PROMPT FOR STRUCTURED FORMULAS
    system_prompt = """
    You are an expert Naval Architect specializing in IRClass rules.
    Your task is to analyze official regulations and extract ONLY explicit measurable technical constraints.

    STRICT RULES:
    1. Do NOT invent data. Extract only what is stated.
    2. Convert word-based rules to structured logic.
    3. If a rule specifies a range (e.g., 'between 5% and 8%'), create two separate rules for 'min' and 'max'.
    4. For single-value rules (e.g., 'not exceeding 2.0m'), use the correct condition.
    5. Preserve units exactly as written in the text.
    
    Output ONLY a valid JSON object.
    """

    user_prompt = f"""
    Extract all measurable constraints from this text block:

    "{chunk_text}"

    Return JSON in this EXACT format:
    {{
        "rules": [
            {{
                "category": "string (e.g. Hull, Stability, Machinery, Safety, General)",
                "parameter_name": "string (The subject of the rule, e.g., 'Collision Bulkhead Location')",
                "left_param": "string (The variable being checked, e.g., 'distance_from_fp')",
                "condition": "string (one of: '>=', '<=', '>', '<', '==', '!=')",
                "right_param": "string (The value, including units or formula, e.g., '0.05 * LBP' or '8 mm')",
                "description": "string (The original rule sentence from the text)"
            }}
        ]
    }}
    """

    payload = {
        "model": MODEL_NAME,
        "temperature": 0.1,
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
    
    start = clean_text.find("{")
    end = clean_text.rfind("}")
    if start != -1 and end != -1:
        clean_text = clean_text[start:end+1]

    data = json.loads(clean_text)
    return data.get("rules", [])

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