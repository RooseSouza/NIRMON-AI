from app.db.models import RuleMaster
from app import db

class RuleEngine:

    def apply_derived_rules(self, hull_model, module, vessel_type_id):

        rules = RuleMaster.query.filter_by(
            module=module,
            vessel_type_id=vessel_type_id,
            constraint_type="DERIVED",
            status=True
        ).order_by(RuleMaster.priority).all()

        context = {}

        # Copy hull attributes
        for key in dir(hull_model):
            if not key.startswith("_") and not callable(getattr(hull_model, key)):
                try:
                    context[key] = getattr(hull_model, key)
                except Exception:
                    pass

        # Naval Architecture shorthand
        if hasattr(hull_model, "length_between_perpendiculars"):
            context["L"] = float(hull_model.length_between_perpendiculars or 0)
        if hasattr(hull_model, "moulded_breadth"):
            context["B"] = float(hull_model.moulded_breadth or 0)
        if hasattr(hull_model, "design_draft"):
            context["T"] = float(hull_model.design_draft or 0)
        if hasattr(hull_model, "moulded_depth"):
            context["D"] = float(hull_model.moulded_depth or 0)

        safe_functions = {
            "max": max,
            "min": min,
            "abs": abs,
            "float": float,
            "int": int,
            "round": round
        }

        # Apply rules
        for rule in rules:
            try:
                value = eval(rule.expression_value, safe_functions, context)
                setattr(hull_model, rule.parameter_name, value)
                context[rule.parameter_name] = value
            except Exception as e:
                print(f"[RULE ERROR] Rule ID {rule.rule_id}: {e}")

        return hull_model