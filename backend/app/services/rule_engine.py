from app.db.models import RuleMaster
from app.db.database import db


class RuleEngine:

    def validate(self, layout: dict, input_data: dict = None):

        violations = []

        context = {}
        if input_data:
            context.update(input_data)
        if layout:
            context.update(layout)

        # Fetch active rules (boolean column)
        rules = RuleMaster.query.filter_by(status=True).all()

        for rule in rules:

            param = rule.parameter_name
            operator = rule.operator
            expression = rule.expression_value
            constraint_type = rule.constraint_type

            actual_value = context.get(param)

            if actual_value is None:
                continue

            try:
                # Safe eval functions
                safe_functions = {
                    "max": max,
                    "min": min,
                    "abs": abs,
                    "float": float,
                    "int": int
                }

                expected_value = eval(expression, safe_functions, context)

                condition_failed = False

                if operator == ">=":
                    condition_failed = not (float(actual_value) >= float(expected_value))
                elif operator == "<=":
                    condition_failed = not (float(actual_value) <= float(expected_value))
                elif operator == "==":
                    condition_failed = not (str(actual_value) == str(expected_value))
                elif operator == "!=":
                    condition_failed = not (str(actual_value) != str(expected_value))
                elif operator == ">":
                    condition_failed = not (float(actual_value) > float(expected_value))
                elif operator == "<":
                    condition_failed = not (float(actual_value) < float(expected_value))

                if condition_failed:
                    violations.append({
                        "rule_id": rule.rule_id,
                        "category": rule.category,
                        "message": f"{param} violates rule {rule.rule_id}",
                        "severity": "CRITICAL" if constraint_type == "HARD" else "WARNING"
                    })

            except Exception as e:
                print(f"Rule {rule.rule_id} failed to evaluate:", e)
                continue

        return violations