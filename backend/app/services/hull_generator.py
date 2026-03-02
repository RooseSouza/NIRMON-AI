import math
import numpy as np

class HullGenerator:

    # ==========================================================
    # TOP VIEW (Harbour Tug Style)
    # ==========================================================
    @staticmethod
    def generate_top_view(hull):
        L = float(hull.length_between_perpendiculars)
        B = float(hull.breadth_moulded) / 2

        Le = float(hull.entrance_length)
        Lp = float(hull.parallel_midbody_length)
        Lr = float(hull.run_length)

        # Fullness control (from your rules)
        bow_full = getattr(hull, "bow_fullness_factor", 1.4)
        stern_full = getattr(hull, "stern_fullness_factor", 1.25)

        # Spline control points for half-breadth
        bow_pt = Le / L
        midf_pt = (Le + Lp) / L
        run_pt = 1.0

        xs = []
        ys = []

        # Bow flare: gentle outward curve
        for t in np.linspace(0, bow_pt, 200):
            width = B * bow_full * (math.sin(math.pi/2 * (t/bow_pt)))**0.8
            xs.append(t * L)
            ys.append(width)

        # Midship: constant full beam
        for t in np.linspace(bow_pt, midf_pt, 200):
            xs.append(t * L)
            ys.append(B)

        # Stern run: smooth fairing back toward beam
        for t in np.linspace(midf_pt, run_pt, 200):
            run_ratio = (t - midf_pt) / (run_pt - midf_pt)
            width = B - (B * 0.15 * (run_ratio**1.5)) * stern_full
            xs.append(t * L)
            ys.append(width)

        # Build final upper and lower half-breadth
        upper = list(zip(xs, ys))
        lower = [(x, -y) for x, y in upper[::-1]]

        return upper, lower

    # ==========================================================
    # PROFILE VIEW (Deep Forefoot + Heavy Stern)
    # ==========================================================
    @staticmethod
    def generate_profile(hull):
        L = float(hull.length_between_perpendiculars)
        T = float(hull.design_draft)

        Le = float(hull.entrance_length)
        Lr = float(hull.run_length)

        sheer = getattr(hull, "sheer_height", 0.03 * L)
        forefoot = getattr(hull, "forefoot_factor", 0.08 * T)

        x_vals = np.linspace(0, L, 350)
        profile = []

        for x in x_vals:
            z = T

            # Deep forefoot at bow
            if x < Le:
                r = x / Le
                z -= forefoot * (1 - r ** 2)

            # Stern run drop
            if x > L - Lr:
                r = (x - (L - Lr)) / Lr
                z -= 0.05 * T * (r ** 1.5)

            # Sheer curvature
            z += sheer * math.sin(math.pi * x / L)

            profile.append((x, z))

        return profile

    # ==========================================================
    # BODY SECTION (Rounded Bilge + Flat Bottom)
    # ==========================================================
    @staticmethod
    def generate_body_section(hull, station_position):
        B = float(hull.breadth_moulded) / 2
        T = float(hull.design_draft)

        fullness = getattr(hull, "midship_fullness", 1.3)
        flat_ratio = getattr(hull, "flat_bottom_ratio", 0.35)
        bilge_radius = getattr(hull, "bilge_radius", 0.12 * B)

        z_vals = np.linspace(0, T, 250)
        section = []

        for i, r in enumerate(z_vals / T):
            if r < flat_ratio:
                width = B
            else:
                r2 = (r - flat_ratio) / (1 - flat_ratio)
                width = B * (1 - (r2 ** fullness))

            # Apply bilge rounding near bottom
            if r < flat_ratio + 0.05:  # small zone for bilge radius
                width *= (r / (flat_ratio + 0.05)) ** 0.5

            section.append((width, z_vals[i]))

        left = [(-x, z) for (x, z) in reversed(section)]
        return left + section