from openai import OpenAI
import os
import json
import time


# ==============================
# CONFIG
# ==============================
MODEL_NAME = "google/gemma-3-12b-it"
CHUNK_SIZE = 12000          # characters per chunk
CHUNK_OVERLAP = 1500        # overlap to avoid cutting rules
MAX_RETRIES = 4


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

    system_prompt = """
You are a Senior Naval Architect and Classification Rule Specialist.

You are analyzing official Indian Register of Shipping (IRClass) rules.

Extract ONLY explicit measurable technical constraints.

STRICT RULES:
1. Do NOT invent formulas.
2. Do NOT infer unstated values.
3. Preserve units exactly.
4. Include clause numbers if present.
5. If formula written in words, convert to math.
6. If no measurable rule exists, return empty list.

Output ONLY valid JSON.
No markdown.
No commentary.
Must start with { and end with }.
"""

    user_prompt = f"""
Extract all measurable dimensional, structural, stability,
machinery, and safety constraints from this text:

{chunk_text}

Return EXACT JSON format:

{{
    "rules": [
        {{
            "category": "Hull / Stability / Machinery / Safety / General",
            "parameter": "string",
            "formula": "string",
            "description": "string"
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

    # Remove markdown if added
    if clean_text.startswith("```json"):
        clean_text = clean_text[7:]
    if clean_text.startswith("```"):
        clean_text = clean_text[3:]
    if clean_text.endswith("```"):
        clean_text = clean_text[:-3]

    clean_text = clean_text.strip()

    # Extract JSON block safely
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

    print("\n--- 🚀 Starting IRClass Full Document Extraction ---")

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "OPENROUTER_API_KEY is missing in .env", "status": 500}

    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
        )

        # 1️⃣ Split into chunks
        chunks = chunk_text(raw_text)
        print(f"📄 Total Chunks Created: {len(chunks)}")

        all_rules = []

        # 2️⃣ Process each chunk
        for i, chunk in enumerate(chunks):
            print(f"🔹 Processing Chunk {i+1}/{len(chunks)}")

            try:
                chunk_rules = extract_chunk_rules(client, chunk)
                print(f"   → Extracted {len(chunk_rules)} rules")
                all_rules.extend(chunk_rules)
            except Exception as chunk_error:
                print(f"   ❌ Chunk {i+1} failed: {chunk_error}")

        print(f"\n📊 Total Raw Rules Extracted: {len(all_rules)}")

        # 3️⃣ Remove garbage / N/A rules
        filtered_rules = [
            r for r in all_rules
            if r.get("parameter")
            and r.get("parameter") not in ["N/A", "", None]
            and r.get("formula") not in ["N/A", "", None]
        ]

        print(f"🧹 After Cleaning: {len(filtered_rules)} rules")

        # 4️⃣ Deduplicate rules
        unique_rules = {}
        for r in filtered_rules:
            key = (r["parameter"], r["formula"])
            unique_rules[key] = r

        final_rules = list(unique_rules.values())

        print(f"🎉 Final Unique Rules: {len(final_rules)}")

        return {
            "success": True,
            "data": final_rules
        }

    except Exception as e:
        print(f"❌ OpenRouter Error: {str(e)}")
        return {"error": str(e), "status": 500}