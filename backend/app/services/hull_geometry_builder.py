class HullGeometryModel:
    def __init__(self, loa, lbp, breadth, depth, draft):
        self.loa = float(loa)
        self.lbp = float(lbp)
        self.breadth = float(breadth)
        self.depth = float(depth)
        self.draft = float(draft)

        # Derived naval architecture values
        self.midship_x = self.lbp / 2
        self.deck_z = self.depth
        self.keel_z = 0.0

    def to_dict(self):
        return {
            "loa": self.loa,
            "lbp": self.lbp,
            "breadth": self.breadth,
            "depth": self.depth,
            "draft": self.draft,
            "midship_x": self.midship_x,
            "deck_z": self.deck_z,
            "keel_z": self.keel_z
        }


class HullGeometryBuilder:

    @staticmethod
    def build(hull_db_object):
        return HullGeometryModel(
            loa=hull_db_object.length_overall,
            lbp=hull_db_object.length_between_perpendiculars,
            breadth=hull_db_object.breadth_moulded,
            depth=hull_db_object.depth_moulded,
            draft=hull_db_object.design_draft
        )