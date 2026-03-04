class LayoutEngine:

    def generate_layout(self, data):

        loa = float(data.get("loa", 0))
        beam = float(data.get("beam", 0))

        engine_room_length = 0.15 * loa
        cargo_length = loa - engine_room_length

        layout = {
            "engine_room": {
                "start": cargo_length,
                "end": loa
            },
            "cargo_zone": {
                "start": 0,
                "end": cargo_length
            }
        }

        return layout