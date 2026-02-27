# app/services/hull_geometry_builder.py

class HullGeometry:
    def __init__(
        self,
        loa,
        lbp,
        breadth,
        depth,
        draft,

        # Form coefficients
        block_coefficient=0.0,
        prismatic_coefficient=0.0,

        # Longitudinal form
        midbody_length=0.0,
        bow_rake_angle=0.0,
        stern_rake_angle=0.0,

        # Section shape
        bilge_radius=0.0,

        # Bulb
        bulbous_bow=False,
        bulb_length=0.0,
        bulb_height=0.0,

        # DXF grid control
        num_stations=20,
        num_waterlines=7,
        num_buttocks=5
    ):

        # ------------------------
        # Principal Dimensions
        # ------------------------
        self.loa = float(loa)
        self.lbp = float(lbp)
        self.breadth = float(breadth)
        self.depth = float(depth)
        self.draft = float(draft)

        # ------------------------
        # Form Coefficients
        # ------------------------
        self.block_coefficient = float(block_coefficient)
        self.prismatic_coefficient = float(prismatic_coefficient)

        # ------------------------
        # Derived Geometry
        # ------------------------
        self.midship_x = self.lbp / 2
        self.deck_z = self.depth
        self.keel_z = 0.0

        # ------------------------
        # Longitudinal Features
        # ------------------------
        self.parallel_midbody_length = float(midbody_length)
        self.bow_rake_angle = float(bow_rake_angle)
        self.stern_rake_angle = float(stern_rake_angle)

        # ------------------------
        # Section Shape
        # ------------------------
        self.bilge_radius = float(bilge_radius)

        # ------------------------
        # Bulb Features
        # ------------------------
        self.bulbous_bow = bool(bulbous_bow)
        self.bulb_length = float(bulb_length)
        self.bulb_height = float(bulb_height)

        # ------------------------
        # DXF Grid Controls
        # ------------------------
        self.num_stations = int(num_stations)
        self.num_waterlines = int(num_waterlines)
        self.num_buttocks = int(num_buttocks)

        # ------------------------
        # Basic Validation
        # ------------------------
        self._validate()

    # ---------------------------------
    # Validation Rules (Rule Engine Layer)
    # ---------------------------------
    def _validate(self):

        if self.draft >= self.depth:
            raise ValueError("Draft must be less than Depth.")

        if not (0.5 <= self.block_coefficient <= 0.85):
            raise ValueError("Block Coefficient (Cb) must be between 0.5 and 0.85.")

        if self.parallel_midbody_length > self.lbp:
            raise ValueError("Parallel midbody length cannot exceed LBP.")

        if self.breadth / self.lbp > 0.4:
            raise ValueError("Beam/LBP ratio too large for conventional hull.")

    # ---------------------------------
    # Hydrostatic Helper
    # ---------------------------------
    def displacement_volume(self):
        """
        Approximate displacement volume using block coefficient
        """
        return self.lbp * self.breadth * self.draft * self.block_coefficient

    # ---------------------------------
    # Export for DXF Generator
    # ---------------------------------
    def to_dict(self):
        return {
            "loa": self.loa,
            "lbp": self.lbp,
            "breadth": self.breadth,
            "depth": self.depth,
            "draft": self.draft,
            "block_coefficient": self.block_coefficient,
            "prismatic_coefficient": self.prismatic_coefficient,
            "midship_x": self.midship_x,
            "deck_z": self.deck_z,
            "keel_z": self.keel_z,
            "parallel_midbody_length": self.parallel_midbody_length,
            "bow_rake_angle": self.bow_rake_angle,
            "stern_rake_angle": self.stern_rake_angle,
            "bilge_radius": self.bilge_radius,
            "bulbous_bow": self.bulbous_bow,
            "bulb_length": self.bulb_length,
            "bulb_height": self.bulb_height,
            "num_stations": self.num_stations,
            "num_waterlines": self.num_waterlines,
            "num_buttocks": self.num_buttocks,
            "displacement_volume": self.displacement_volume()
        }


class HullGeometryBuilder:

    @staticmethod
    def build(hull_db_object):
        """
        Build HullGeometry from HullGeometry database object
        """

        return HullGeometry(
            loa=hull_db_object.length_overall,
            lbp=hull_db_object.length_between_perpendiculars,
            breadth=hull_db_object.breadth_moulded,
            depth=hull_db_object.depth_moulded,
            draft=hull_db_object.design_draft,
            block_coefficient=hull_db_object.block_coefficient,
            prismatic_coefficient=hull_db_object.prismatic_coefficient,
            midbody_length=hull_db_object.parallel_midbody_length,
            bow_rake_angle=hull_db_object.bow_rake_angle,
            stern_rake_angle=hull_db_object.stern_rake_angle,
            bilge_radius=hull_db_object.bilge_radius,
            bulbous_bow=hull_db_object.bulbous_bow,
            bulb_length=hull_db_object.bulb_length,
            bulb_height=hull_db_object.bulb_height,
            num_stations=hull_db_object.num_stations,
            num_waterlines=hull_db_object.num_waterlines,
            num_buttocks=hull_db_object.num_buttocks
        )