import ezdxf
import os

class DXFGenerator:

    def generate(self, geometry_model, file_name="hull_output.dxf"):

        doc = ezdxf.new()
        msp = doc.modelspace()

        loa = geometry_model.loa
        depth = geometry_model.depth
        draft = geometry_model.draft
        deck_z = geometry_model.deck_z
        keel_z = geometry_model.keel_z
        midship_x = geometry_model.midship_x

        # Baseline
        msp.add_line((0, keel_z), (loa, keel_z))

        # Deck Line
        msp.add_line((0, deck_z), (loa, deck_z))

        # Midship Line
        msp.add_line((midship_x, keel_z), (midship_x, deck_z))

        output_dir = "outputs"

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        file_path = os.path.join(output_dir, file_name)

        # your dxf drawing code here
        doc.saveas(file_path)

        return file_path
    

    def generate_from_geometry(self, geometry_model, filename="hull_output.dxf"):

        print("Generating DXF from geometry model...")

        geo = geometry_model.to_dict()

        print("LOA:", geo["loa"])
        print("Breadth:", geo["breadth"])
        print("Depth:", geo["depth"])

        # For now just return fake path
        return f"outputs/{filename}"