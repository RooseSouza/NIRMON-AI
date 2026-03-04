# app/services/hull_geometry_builder.py

class HullGeometryModel:
    def __init__(
        self,
        loa, lbp, breadth, depth, draft,
        midbody_length=None,
        bow_rake_angle=0.0,
        stern_rake_angle=0.0,
        bilge_radius=0.0,
        bulbous_bow=False,
        bulb_length=0.0,
        bulb_height=0.0
    ):
        # Principal dimensions
        self.loa = float(loa)
        self.lbp = float(lbp)
        self.breadth = float(breadth)
        self.depth = float(depth)
        self.draft = float(draft)

        # Derived points
        self.midship_x = self.lbp / 2
        self.deck_z = self.depth
        self.keel_z = 0.0

        # Longitudinal / transverse features
        self.parallel_midbody_length = float(midbody_length or 0)
        self.bow_rake_angle = float(bow_rake_angle or 0)
        self.stern_rake_angle = float(stern_rake_angle or 0)
        self.bilge_radius = float(bilge_radius or 0)

        # Bow features
        self.bulbous_bow = bulbous_bow
        self.bulb_length = float(bulb_length or 0)
        self.bulb_height = float(bulb_height or 0)

    def to_dict(self):
        return {
            "loa": self.loa,
            "lbp": self.lbp,
            "breadth": self.breadth,
            "depth": self.depth,
            "draft": self.draft,
            "midship_x": self.midship_x,
            "deck_z": self.deck_z,
            "keel_z": self.keel_z,
            "parallel_midbody_length": self.parallel_midbody_length,
            "bow_rake_angle": self.bow_rake_angle,
            "stern_rake_angle": self.stern_rake_angle,
            "bilge_radius": self.bilge_radius,
            "bulbous_bow": self.bulbous_bow,
            "bulb_length": self.bulb_length,
            "bulb_height": self.bulb_height
        }


class HullGeometryBuilder:
    @staticmethod
    def build(hull_db_object):
        """
        Build HullGeometryModel from HullGeometry database object
        """
        return HullGeometryModel(
            loa=hull_db_object.length_overall,
            lbp=hull_db_object.length_between_perpendiculars,
            breadth=hull_db_object.breadth_moulded,
            depth=hull_db_object.depth_moulded,
            draft=hull_db_object.design_draft,
            midbody_length=hull_db_object.parallel_midbody_length,
            bow_rake_angle=hull_db_object.bow_rake_angle,
            stern_rake_angle=hull_db_object.stern_rake_angle,
            bilge_radius=hull_db_object.bilge_radius,
            bulbous_bow=hull_db_object.bulbous_bow,
            bulb_length=hull_db_object.bulb_length,
            bulb_height=hull_db_object.bulb_height
        )