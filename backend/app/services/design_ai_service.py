from openai import OpenAI
import os
import json

def generate_ship_coordinates():
    print("\n--- 🚀 Asking Gemma 3 for Engineering-Grade RSV Design ---")
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "API Key missing"}

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    # --- 1. HARD MATHEMATICAL CONSTRAINTS ---
    # We calculate these here so the AI has a rigid skeleton to follow
    LOA = 88.0
    LBP = 82.0
    DEPTH = 7.5
    DRAFT = 5.5
    
    # Longitudinal Stations (X-Axis)
    X_AP = 0.0
    X_SKEG = 4.0
    X_ER_BHD = 18.0
    X_MIDSHIP = LBP / 2
    X_COLLISION_BHD = LBP * 0.92  # ~75.4m
    X_FP = LBP
    X_BOW_TIP = LOA
    
    # Vertical Heights (Y-Axis)
    Y_KEEL = 0.0
    
    Y_DECK_LOW = DEPTH
    Y_SHEER_AFT = DEPTH + 0.8
    Y_SHEER_FWD = DEPTH + 2.2

    Y_TANK_TOP = 1.4

    system_prompt = """
    You are a Naval Architecture Parametric Engine. 
    Your goal is to output a mathematically perfect General Arrangement Profile in JSON.
    
    RULES OF PHYSICS:
    1. The Hull Line MUST be a single closed loop.
    2. Do NOT allow lines to cross (No zig-zags).
    3. Draw components in a logical order (Aft -> Fwd).
    4. Y-Axis: 0 is Bottom.
    """

    user_prompt = f"""
    Generate coordinates for an RSV Type 1 Vessel.
    
    **FRAMEWORK CONSTANTS (Use these Exact Values):**
    - Aft Perpendicular (AP): X={X_AP}
    - Engine Room Bulkhead: X={X_ER_BHD}
    - Collision Bulkhead: X={X_COLLISION_BHD}
    - Forward Perpendicular (FP): X={X_FP}
    - Deck Height (Midship): Y={Y_DECK_LOW}
    
    **GEOMETRY INSTRUCTIONS:**

    1. **'hull_outline' (Trace Counter-Clockwise):**
       - Start Top-Left: Aft Deck (X=-2, Y={Y_SHEER_AFT})
       - Down to Transom: (X=-2, Y=5)
       - In to Propeller Aperture top: (X=1, Y=4)
       - Down to Skeg bottom: (X=1, Y=0.5)
       - Forward to Keel start: (X={X_SKEG}, Y=0)
       - Run along Keel to Bulb start: (X={X_FP}, Y=0)
       - Up/Out to Bulbous Bow tip: (X={X_BOW_TIP}, Y=3.5)
       - Up to Forecastle Deck: (X={X_BOW_TIP-1}, Y={Y_SHEER_FWD})
       - Back along Main Deck (Sheer Curve) to Start.

    2. **'superstructure' (Accommodation):**
       - Must sit ON TOP of the deck (Y >= {Y_SHEER_AFT}).
       - Located between X=-2 and X={X_ER_BHD}.
       - 4 Decks high (approx 10m tall total).
       
    3. **'hatch_coamings':**
       - Two boxes ON TOP of Main Deck (Y >= {Y_DECK_LOW}).
       - Hatch 1: Between {X_ER_BHD} and {X_MIDSHIP}.
       - Hatch 2: Between {X_MIDSHIP} and {X_COLLISION_BHD}.

    4. **'internal_structure':**
       - Tank Top: Line at Y={Y_TANK_TOP} inside hull.
       - Bulkheads: Vertical lines at X={X_SKEG}, {X_ER_BHD}, {X_MIDSHIP}, {X_COLLISION_BHD}.

    5. **'appendages':**
       - Rudder: Behind X=1.
       - Propeller: At X=2.5, Y=2.0.
       - Funnel: On top of superstructure.

       Give labels to not all but most components with their name and dont make the labels so big that it overlaps the geometry. make them small and readable.

    **OUTPUT JSON:**
    {{
      "hull_outline": [[x,y], ...],
      "waterline": [[x,y], [x,y]],
      "tank_top": [[x,y], [x,y]],
      "bulkheads": [x1, x2, x3, x4],
      "superstructure": [[x,y], ...],
      "hatch_coamings": [ [[x,y],...], ... ],
      "funnel": [[x,y], ...],
      "rudder": [[x,y], ...],
      "propeller": [[x,y], ...],
      "anchor": [[x,y], ...],
      "labels": [ {{ "text": "NAME", "pos": [x,y] }} ]
    }}
    """

    try:
        completion = client.chat.completions.create(
            model="arcee-ai/trinity-large-preview:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={ "type": "json_object" } 
        )

        raw_content = completion.choices[0].message.content
        
        # Clean JSON
        clean_text = raw_content.strip()
        if clean_text.startswith("```json"): clean_text = clean_text[7:]
        if clean_text.startswith("```"): clean_text = clean_text[3:]
        if clean_text.endswith("```"): clean_text = clean_text[:-3]
        if "}" in clean_text: clean_text = clean_text[:clean_text.rfind("}")+1]

        data = json.loads(clean_text)
        print("✅ AI generated valid naval geometry.")
        return data

    except Exception as e:
        print(f"❌ AI Error: {e}")
        # Mathematical Fallback (Prevents ugly zig-zags if AI fails)
        return {
            "hull_outline": [
                [-2, Y_SHEER_AFT], [-2, 4], [1, 3], [1, 0], 
                [LBP, 0], [LOA, 3.5], [LOA-1, Y_SHEER_FWD], 
                [LBP/2, Y_DECK_LOW], [-2, Y_SHEER_AFT]
            ],
            "waterline": [[-3, DRAFT], [LOA+1, DRAFT]],
            "tank_top": [[X_ER_BHD, Y_TANK_TOP], [X_COLLISION_BHD, Y_TANK_TOP]],
            "bulkheads": [X_SKEG, X_ER_BHD, X_MIDSHIP, X_COLLISION_BHD],
            "superstructure": [
                [-2, Y_SHEER_AFT], [X_ER_BHD, Y_SHEER_AFT], 
                [X_ER_BHD, Y_SHEER_AFT+8], [-2, Y_SHEER_AFT+8], 
                [-2, Y_SHEER_AFT]
            ],
            "hatch_coamings": [
                [[X_ER_BHD+2, Y_DECK_LOW], [X_MIDSHIP-2, Y_DECK_LOW], [X_MIDSHIP-2, Y_DECK_LOW+1.5], [X_ER_BHD+2, Y_DECK_LOW+1.5]],
                [[X_MIDSHIP+2, Y_DECK_LOW], [X_COLLISION_BHD-2, Y_DECK_LOW], [X_COLLISION_BHD-2, Y_DECK_LOW+1.5], [X_MIDSHIP+2, Y_DECK_LOW+1.5]]
            ],
            "funnel": [[2, Y_SHEER_AFT+8], [6, Y_SHEER_AFT+8], [7, Y_SHEER_AFT+11], [1, Y_SHEER_AFT+11]],
            "rudder": [[-1.5, 0], [0.5, 0], [0.5, 3], [-1.5, 3]],
            "propeller": [[1.5, 1], [3.5, 3]],
            "anchor": [[X_FP, Y_DECK_LOW-1], [X_FP+1, Y_DECK_LOW-2]],
            "labels": [{"text": "FALLBACK GEOMETRY", "pos": [LOA/2, Y_DECK_LOW+5]}]
        }