# app/services/dxf_generator.py
import ezdxf
import math
import matplotlib.pyplot as plt

class DXFGenerator:
    @staticmethod
    def generate(hull_model, filename="hull_output.dxf", num_stations=50, generate_image=False):
        """
        Realistic 2D hull DXF generator with labeled parts and improved bilge curve.

        Features:
        - Smooth bow and stern using cubic interpolation
        - Parallel midbody
        - Half-breadth flare
        - Elliptical bulbous bow
        - Smooth bilge using cubic blend (more realistic)
        - DXF labels and color coding
        - Optional labeled image output
        """
        doc = ezdxf.new(dxfversion="R2010")
        msp = doc.modelspace()

        # Extract parameters
        loa = hull_model.loa
        lbp = hull_model.lbp
        keel_z = hull_model.keel_z
        deck_z = hull_model.deck_z
        midship_x = hull_model.midship_x
        breadth = hull_model.breadth
        draft = hull_model.draft
        parallel_length = hull_model.parallel_midbody_length
        bulbous = hull_model.bulbous_bow
        bulb_length = hull_model.bulb_length
        bulb_height = hull_model.bulb_height
        bilge_radius = hull_model.bilge_radius

        # -----------------------------
        # 1️⃣ Side profile (X vs Z)
        # -----------------------------
        side_points = []
        bow_length = hull_model.bow_rake_angle * lbp / 100  # approximate bow length
        stern_length = hull_model.stern_rake_angle * lbp / 100  # approximate stern length

        for i in range(num_stations + 1):
            x = (lbp / num_stations) * i
            if x < bow_length:
                t = x / bow_length
                z = keel_z + draft * (3*t**2 - 2*t**3)  # cubic interpolation
            elif x > lbp - stern_length:
                t = (lbp - x) / stern_length
                z = keel_z + draft * (3*t**2 - 2*t**3)
            else:
                z = keel_z + draft
            side_points.append((x, z))

        msp.add_spline(side_points, dxfattribs={'color': 1})  # red

        # Deck, keel, midship
        msp.add_line((0, deck_z), (lbp, deck_z), dxfattribs={'color': 2})  # green
        msp.add_line((0, keel_z), (lbp, keel_z), dxfattribs={'color': 3})   # blue
        msp.add_line((midship_x, keel_z), (midship_x, deck_z), dxfattribs={'color': 4}) # yellow

        # Labels
        msp.add_text("Deck", dxfattribs={'insert': (midship_x, deck_z + 0.5), 'height': 0.5})
        msp.add_text("Keel", dxfattribs={'insert': (midship_x, keel_z - 0.5), 'height': 0.5})
        msp.add_text("Midship", dxfattribs={'insert': (midship_x + 1, draft/2), 'height': 0.5})

        # -----------------------------
        # 2️⃣ Bulbous bow (smoothed ellipse)
        # -----------------------------
        bulb_points = []
        if bulbous and bulb_length > 0 and bulb_height > 0:
            for angle in range(0, 181, 5):
                rad = math.radians(angle)
                bx = -bulb_length * math.cos(rad)
                bz = keel_z - bulb_height * math.sin(rad) * 0.6
                bulb_points.append((bx, bz))
            msp.add_spline(bulb_points, dxfattribs={'color': 5})  # cyan
            msp.add_text("Bulbous Bow", dxfattribs={'insert': (-bulb_length/2, keel_z - bulb_height/2), 'height': 0.5})

        # -----------------------------
        # 3️⃣ Half-breadth (X vs Y)
        # -----------------------------
        half_breadth_points = []
        for i in range(num_stations + 1):
            x = (lbp / num_stations) * i
            if x < bow_length:
                y = (breadth / 2) * (x / bow_length) ** 0.5
            elif x > lbp - stern_length:
                y = (breadth / 2) * ((lbp - x) / stern_length) ** 0.5
            else:
                y = breadth / 2
            half_breadth_points.append((x, y))
        msp.add_spline(half_breadth_points, dxfattribs={'color': 6})  # magenta

        # -----------------------------
        # 4️⃣ Improved Bilge (cubic blend for smoother curvature)
        # -----------------------------
        if bilge_radius > 0:
            bilge_points = []
            steps = 30
            for i in range(steps + 1):
                t = i / steps
                # Cubic blend from keel to side
                x = (1 - t)**3 * 0 \
                    + 3 * (1 - t)**2 * t * (bilge_radius * 0.4) \
                    + 3 * (1 - t) * t**2 * (bilge_radius * 0.8) \
                    + t**3 * bilge_radius

                z = (1 - t)**3 * keel_z \
                    + 3 * (1 - t)**2 * t * (keel_z + bilge_radius * 0.25) \
                    + 3 * (1 - t) * t**2 * (keel_z + bilge_radius * 0.6) \
                    + t**3 * (keel_z + bilge_radius)

                bilge_points.append((x, z))
            msp.add_spline(bilge_points, dxfattribs={'color': 7})  # white
            msp.add_text("Bilge", dxfattribs={'insert': (bilge_radius/2, keel_z + bilge_radius/2), 'height': 0.5})

        # -----------------------------
        # Save DXF
        # -----------------------------
        doc.saveas(filename)

        # -----------------------------
        # Optional: generate labeled image
        # -----------------------------
        if generate_image:
            plt.figure(figsize=(10, 5))
            plt.plot([x for x,z in side_points], [z for x,z in side_points], 'r', label='Side Profile')
            plt.plot([x for x,y in half_breadth_points], [y for x,y in half_breadth_points], 'm', label='Half-Breadth')
            if bulb_points:
                plt.plot([x for x,z in bulb_points], [z for x,z in bulb_points], 'c', label='Bulbous Bow')
            if bilge_radius > 0:
                plt.plot([x for x,z in bilge_points], [z for x,z in bilge_points], 'k', label='Bilge')
            plt.xlabel('X (m)')
            plt.ylabel('Z / Y (m)')
            plt.title('Hull Profile with Labeled Parts')
            plt.legend()
            plt.grid(True)
            plt.savefig('hull_labeled.png', dpi=300)
            plt.show()

        return filename