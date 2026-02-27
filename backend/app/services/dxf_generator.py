import ezdxf
import math


class DXFGenerator:

    @staticmethod
    def generate(hull_model,
                 filename="cargo_lines_plan.dxf",
                 num_stations=30,
                 waterlines=10,
                 buttocks=8):

        doc = ezdxf.new("R2010")
        msp = doc.modelspace()

        # ---------------------------------------------------
        # HULL PARAMETERS
        # ---------------------------------------------------

        L = hull_model.lbp
        B = hull_model.breadth
        T = hull_model.draft
        D = hull_model.depth
        Cb = hull_model.block_coefficient

        offset_x = 50
        offset_y = 50

        sheer_offset_y = offset_y + 350
        halfbreadth_offset_y = offset_y + 150
        body_offset_x = offset_x + L + 180

        # ===================================================
        # CARGO SHIP LONGITUDINAL DISTRIBUTION
        # ===================================================

        def longitudinal_factor(x):
            t = x / L

            # Fine bow
            if t < 0.20:
                return (t / 0.20) ** 2.8

            # Parallel midbody
            elif t <= 0.75:
                return 1.0

            # Cruiser stern
            else:
                return ((1 - t) / 0.25) ** 1.6

        # ===================================================
        # SECTIONAL SHAPE (Rounded Cargo Section)
        # ===================================================

        def vertical_factor(z):
            n = 2.6  # full-bodied cargo section
            return 1 - (1 - (z / T)) ** n

        # ===================================================
        # 1️⃣ SHEER PLAN (SIDE VIEW)
        # ===================================================

        keel_curve = []
        deck_curve = []

        for i in range(250):
            x = L * i / 249
            t = x / L

            # Slight keel rise near bow
            keel_rise = 0
            if t < 0.15:
                keel_rise = 0.03 * T * (1 - (t / 0.15))

            # Deck sheer
            sheer = 0.06 * D * math.sin(math.pi * t)

            keel_curve.append((offset_x + x,
                               sheer_offset_y + keel_rise))

            deck_curve.append((offset_x + x,
                               sheer_offset_y + D + sheer))

        msp.add_spline(keel_curve)
        msp.add_spline(deck_curve)

        # Stations in sheer plan
        for s in range(num_stations + 1):
            x = L * s / num_stations
            msp.add_line(
                (offset_x + x, sheer_offset_y),
                (offset_x + x, sheer_offset_y + D)
            )

        # Waterlines in sheer plan
        for w in range(1, waterlines + 1):
            z = T * w / waterlines
            msp.add_line(
                (offset_x, sheer_offset_y + z),
                (offset_x + L, sheer_offset_y + z)
            )

        # ===================================================
        # 2️⃣ HALF BREADTH PLAN (TOP VIEW)
        # ===================================================

        for w in range(1, waterlines + 1):
            z = T * w / waterlines
            wl_curve = []

            for i in range(250):
                x = L * i / 249
                Fx = longitudinal_factor(x)
                Fy = vertical_factor(z)

                fullness = 0.85 + (Cb - 0.65)

                y = (B / 2) * (Fx ** 0.9) * Fy * fullness

                # Bulbous bow
                if x < 0.08 * L:
                    bulb = math.exp(-((x - 0.04 * L) ** 2) / (0.002 * L * L))
                    y += 0.08 * B * bulb

                wl_curve.append((offset_x + x,
                                 halfbreadth_offset_y + y))

            msp.add_spline(wl_curve)

            # Mirror
            wl_mirror = [
                (x, halfbreadth_offset_y - (y - halfbreadth_offset_y))
                for x, y in wl_curve
            ]
            msp.add_spline(wl_mirror)

        # Stations grid
        for s in range(num_stations + 1):
            x = L * s / num_stations
            msp.add_line(
                (offset_x + x,
                 halfbreadth_offset_y - B / 2),
                (offset_x + x,
                 halfbreadth_offset_y + B / 2)
            )

        # ===================================================
        # 3️⃣ BODY PLAN (SECTIONS)
        # ===================================================

        for s in range(num_stations + 1):
            x = L * s / num_stations
            Fx = longitudinal_factor(x)

            section_curve = []

            for i in range(150):
                z = T * i / 149
                Fy = vertical_factor(z)

                fullness = 0.85 + (Cb - 0.65)

                y = (B / 2) * (Fx ** 0.9) * Fy * fullness

                section_curve.append(
                    (body_offset_x + y,
                     offset_y + z)
                )

            msp.add_spline(section_curve)

            # Mirror section
            section_mirror = [
                (body_offset_x - (x - body_offset_x), z)
                for x, z in section_curve
            ]

            msp.add_spline(section_mirror)

        # ===================================================
        # TITLES
        # ===================================================

        msp.add_text("SHEER PLAN",
                     dxfattribs={"height": 6}).set_pos(
            (offset_x, sheer_offset_y + D + 25)
        )

        msp.add_text("HALF BREADTH PLAN",
                     dxfattribs={"height": 6}).set_pos(
            (offset_x, halfbreadth_offset_y + B)
        )

        msp.add_text("BODY PLAN",
                     dxfattribs={"height": 6}).set_pos(
            (body_offset_x - 40, offset_y + T + 25)
        )

        msp.add_mtext(
            f"""
CARGO SHIP LINES PLAN

LBP: {L} m
Beam: {B} m
Draft: {T} m
Depth: {D} m
Block Coefficient: {Cb}
""",
            dxfattribs={"char_height": 5}
        ).set_location((offset_x, offset_y + 520))

        # ===================================================

        doc.saveas(filename)
        return filename