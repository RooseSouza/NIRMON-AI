import ezdxf
from ezdxf.enums import TextEntityAlignment
from ezdxf.addons.drawing import Frontend, RenderContext
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import io
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def safe_float(val):
    try: return float(val)
    except: return 0.0

def sanitize_point_list(data):
    clean_points = []
    if not isinstance(data, list): return []
    
    number_count = sum(1 for x in data if isinstance(x, (int, float)))
    if number_count == len(data) and len(data) > 0:
        for i in range(0, len(data), 2):
            if i + 1 < len(data):
                clean_points.append((safe_float(data[i]), safe_float(data[i+1])))
        return clean_points

    for item in data:
        if isinstance(item, (list, tuple)) and len(item) >= 2:
            clean_points.append((safe_float(item[0]), safe_float(item[1])))
    return clean_points

def create_dxf_from_json(geometry_data, project_id):
    try:
        doc = ezdxf.new()
        msp = doc.modelspace()
        
        # 1. Hull
        hull = sanitize_point_list(geometry_data.get("hull_outline", []))
        if hull: 
            msp.add_lwpolyline(hull, dxfattribs={'layer': 'SHELL', 'color': 5, 'lineweight': 50})

        # 2. Waterline
        wl = sanitize_point_list(geometry_data.get("waterline", []))
        if len(wl) >= 2:
            msp.add_line(wl[0], wl[1], dxfattribs={'layer': 'WL', 'color': 4, 'linetype': 'DASHED'})

        # 3. Superstructure
        super_struct = sanitize_point_list(geometry_data.get("superstructure", []))
        if super_struct:
            msp.add_lwpolyline(super_struct, close=True, dxfattribs={'layer': 'ACCOMMODATION', 'color': 3})

        # 4. Tank Top
        tt = sanitize_point_list(geometry_data.get("tank_top", []))
        if len(tt) >= 2:
            msp.add_line(tt[0], tt[1], dxfattribs={'layer': 'DB_TOP', 'color': 1})

        # 5. Bulkheads
        max_y = 8.0
        if hull:
            y_vals = [p[1] for p in hull]
            if y_vals: max_y = max(y_vals)

        raw_bulkheads = geometry_data.get("bulkheads", [])
        if isinstance(raw_bulkheads, list):
            for item in raw_bulkheads:
                x_val = None
                if isinstance(item, (int, float)): x_val = item
                elif isinstance(item, list) and len(item) > 0: x_val = safe_float(item[0])
                
                if x_val is not None:
                    msp.add_line((x_val, 0), (x_val, max_y), dxfattribs={'layer': 'BULKHEAD', 'color': 2})

        # 6. Equipment
        raw_hatches = geometry_data.get("hatch_coamings", [])
        if isinstance(raw_hatches, list):
            for h in raw_hatches:
                h_pts = sanitize_point_list(h)
                if h_pts: msp.add_lwpolyline(h_pts, close=True, dxfattribs={'layer': 'HATCH', 'color': 6})

        funnel = sanitize_point_list(geometry_data.get("funnel", []))
        if funnel: msp.add_lwpolyline(funnel, close=True, dxfattribs={'layer': 'FUNNEL', 'color': 8})

        rudder = sanitize_point_list(geometry_data.get("rudder", []))
        if rudder: msp.add_lwpolyline(rudder, close=True, dxfattribs={'layer': 'RUDDER', 'color': 1})

        prop = sanitize_point_list(geometry_data.get("propeller", []))
        if prop: msp.add_lwpolyline(prop, close=True, dxfattribs={'layer': 'PROP', 'color': 1})

        anchor = sanitize_point_list(geometry_data.get("anchor", []))
        if anchor: msp.add_lwpolyline(anchor, close=True, dxfattribs={'layer': 'ANCHOR', 'color': 7})

        # --- 8. LABELS (With Overlap Protection) ---
        labels = geometry_data.get("labels", [])
        placed_positions = [] 

        if isinstance(labels, list):
            for lbl in labels:
                if isinstance(lbl, dict) and "text" in lbl and "pos" in lbl:
                    text_content = lbl["text"]
                    pos_raw = lbl["pos"]
                    
                    if isinstance(pos_raw, list) and len(pos_raw) >= 2:
                        x = safe_float(pos_raw[0])
                        y = safe_float(pos_raw[1])
                        
                        # ✅ SMART STAGGERING ALGORITHM
                        for (px, py) in placed_positions:
                            # If X is too close AND Y is too close, shift up
                            if abs(x - px) < 15.0 and abs(y - py) < 2.0:
                                y += 2.5 # Nudge the label up to avoid overlap
                        
                        placed_positions.append((x, y))

                        text = msp.add_text(
                            text_content, 
                            dxfattribs={
                                'height': 1.5, 
                                'color': 1, # Red
                                'layer': 'LABELS'
                            }
                        )
                        text.set_placement((x, y), align=TextEntityAlignment.MIDDLE_CENTER)

        # Save & Convert
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/outputs'))
        os.makedirs(base_dir, exist_ok=True)

        # 2. Save DXF
        dxf_filename = f"{project_id}.dxf"
        dxf_path = os.path.join(base_dir, dxf_filename)
        doc.saveas(dxf_path)

        # 3. Save SVG (For Frontend Display)
        svg_filename = f"{project_id}.svg"
        svg_path = os.path.join(base_dir, svg_filename)

        fig = plt.figure(figsize=(20, 8))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_axis_off()
        
        ctx = RenderContext(doc)
        out = MatplotlibBackend(ax)
        Frontend(ctx, out).draw_layout(msp, finalize=True)
        
        ax.autoscale(True)
        ax.margins(0.1)
        ax.set_aspect('equal', adjustable='box')

        # Save to file
        fig.savefig(svg_path, format='svg')
        
        # Also return string for immediate response
        img_buffer = io.StringIO()
        fig.savefig(img_buffer, format='svg')
        svg_content = img_buffer.getvalue()
        plt.close(fig)
        
        return svg_content, dxf_filename

    except Exception as e:
        print(f"❌ DXF Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return "", ""