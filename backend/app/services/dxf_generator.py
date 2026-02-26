import ezdxf
import os


class DXFGenerator:

    def generate(self, layout: dict, data: dict, filename: str):

        # Create DXF document
        doc = ezdxf.new("R2010")
        msp = doc.modelspace()

        # Extract main parameters
        beam = float(data.get("beam", 30))

        engine = layout.get("engine_room", {})
        start = engine.get("start", 0)
        end = engine.get("end", 0)

        cargo = layout.get("cargo_zone", {})
        cstart = cargo.get("start", 0)
        cend = cargo.get("end", 0)

        # -------------------------
        # Create Layers
        # -------------------------
        if "ENGINE" not in doc.layers:
            doc.layers.add(name="ENGINE", color=1)  # red

        if "CARGO" not in doc.layers:
            doc.layers.add(name="CARGO", color=3)  # green

        if "TEXT" not in doc.layers:
            doc.layers.add(name="TEXT", color=7)

        # -------------------------
        # Draw Cargo Zone
        # -------------------------
        msp.add_lwpolyline(
            [
                (cstart, 0),
                (cend, 0),
                (cend, beam),
                (cstart, beam),
                (cstart, 0),
            ],
            dxfattribs={"layer": "CARGO"}
        )

        # -------------------------
        # Draw Engine Room
        # -------------------------
        msp.add_lwpolyline(
            [
                (start, 0),
                (end, 0),
                (end, beam),
                (start, beam),
                (start, 0),
            ],
            dxfattribs={"layer": "ENGINE"}
        )

        # -------------------------
        # Add Separation Line
        # -------------------------
        msp.add_line(
            (start, 0),
            (start, beam),
            dxfattribs={"layer": "ENGINE"}
        )

        # -------------------------
        # Add Labels
        # -------------------------
        msp.add_text(
            "CARGO ZONE",
            dxfattribs={"height": beam * 0.05, "layer": "TEXT"}
        ).set_placement((cstart + 5, beam / 2))

        msp.add_text(
            "ENGINE ROOM",
            dxfattribs={"height": beam * 0.05, "layer": "TEXT"}
        ).set_placement((start + 2, beam / 2))

        # -------------------------
        # Ensure folder exists
        # -------------------------
        os.makedirs("generated_files", exist_ok=True)

        file_path = os.path.join("generated_files", filename)
        doc.saveas(file_path)

        return file_path