class HullGeometry:

    def __init__(self, hull_db):

        if hull_db is None:
            raise ValueError("Hull DB object cannot be None")

        def to_float(value, default=0.0):
            try:
                return float(value) if value is not None else default
            except:
                return default

        self.length_overall = to_float(hull_db.length_overall)
        self.length_between_perpendiculars = to_float(hull_db.length_between_perpendiculars)

        self.breadth_moulded = to_float(hull_db.breadth_moulded)
        self.depth_moulded = to_float(hull_db.depth_moulded)
        self.design_draft = to_float(hull_db.design_draft)

        self.block_coefficient = to_float(hull_db.block_coefficient)
        self.prismatic_coefficient = to_float(hull_db.prismatic_coefficient)
        self.midship_coefficient = to_float(hull_db.midship_coefficient)

        self.parallel_midbody_length = to_float(hull_db.parallel_midbody_length)
        self.entrance_length = to_float(hull_db.entrance_length)
        self.run_length = to_float(hull_db.run_length)

        # Auto correction if lengths don't sum to L
        total = self.parallel_midbody_length + self.entrance_length + self.run_length
        if total > 0:
            scale = self.length_between_perpendiculars / total
            self.parallel_midbody_length *= scale
            self.entrance_length *= scale
            self.run_length *= scale

        self.bow_rake_angle = to_float(hull_db.bow_rake_angle)
        self.stern_rake_angle = to_float(hull_db.stern_rake_angle)

        self.bilge_radius = to_float(hull_db.bilge_radius)
        self.stern_type = hull_db.stern_type
        self.hull_form_type = getattr(hull_db, "hull_form_type", "GENERIC")

        self.frame_spacing = to_float(hull_db.frame_spacing)

    def to_dict(self):
        return dict(self.__dict__)


class HullGeometryBuilder:

    @staticmethod
    def build(hull_db_object):
        return HullGeometry(hull_db_object)