
import joblib
from pathlib import Path

MODEL_PATH = (
    Path(__file__).resolve().parent
    / "temperature_decision_tree.pkl"
)

_model_bundle = None


def load_model():
    global _model_bundle

    if _model_bundle is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Temperature model not found: {MODEL_PATH}"
            )

        _model_bundle = joblib.load(MODEL_PATH)

    return _model_bundle


def predict_temperature(
    temperature_c,
    humidity_pct,
    temperature_rise_c_per_min,
    network_available,
):
    bundle = load_model()
    model = bundle["model"]
    features = bundle["features"]

    sample = [[
        temperature_c,
        humidity_pct,
        temperature_rise_c_per_min,
        network_available,
    ]]

    import pandas as pd

    prediction = model.predict(
        pd.DataFrame(sample, columns=features)
    )[0]

    return str(prediction)
