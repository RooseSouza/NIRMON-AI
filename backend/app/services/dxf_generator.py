import os
import ezdxf

class DXFGenerator:
    @staticmethod
    def generate(hull, geometry, output_path="outputs/generated_hull.dxf"):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        doc = ezdxf.new("R2010")
        msp = doc.modelspace()

        L = float(hull.length_between_perpendiculars)
        B = float(hull.breadth_moulded)
        D = float(hull.depth_moulded)
        T = float(hull.design_draft)

        # PROFILE VIEW
        msp.add_lwpolyline(geometry["profile"])
        msp.add_text("PROFILE VIEW", dxfattribs={"height": 2}).set_placement((0, -5))

        # BODY PLAN
        offset_x = L + 30
        body_pts = [(x + offset_x, y) for (x, y) in geometry["body"]]
        msp.add_lwpolyline(body_pts)
        msp.add_text("BODY PLAN", dxfattribs={"height": 2}).set_placement((offset_x, -5))

        # TOP VIEW
        offset_y = D + 15
        upper = [(x, y + offset_y) for (x, y) in geometry["top"][0]]
        lower = [(x, y + offset_y) for (x, y) in geometry["top"][1]]

        msp.add_lwpolyline(upper)
        msp.add_lwpolyline(list(reversed(lower)))
        msp.add_text("TOP VIEW", dxfattribs={"height": 2}).set_placement((0, offset_y + B))

        doc.saveas(output_path)
        return output_path