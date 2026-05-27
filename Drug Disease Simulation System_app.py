from flask import Flask, render_template, request, jsonify
import numpy as np

# IMPORT FROM BACKEND
from major_project_2_backend_fin import train_model, build_features, scaler, simulate_from_prediction

app = Flask(__name__)

print("🚀 Training model (only once)...")
model = train_model()

# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/")
def home():
    return render_template("index.html")

# ============================================================
# SIMULATION API
# ============================================================

@app.route("/simulate", methods=["POST"])
def simulate():

    data = request.json
    smiles = data.get("smiles")
    disease = data.get("disease")

    # 🔧 FIX: build_features returns ONLY features (your final backend)
    features = build_features(smiles)

    if features is None:
        return jsonify({"error": "Invalid SMILES"})

    # Scale input
    features = scaler.transform(features.reshape(1, -1))

    # Predict
    pred = model.predict(features, verbose=0)[0]

    # Simulation
    result = simulate_from_prediction(pred, disease)

    # 🔧 CRITICAL FIX: Convert NumPy → Python types
    result = {
        "binding": float(result["binding"]),
        "pathway": float(result["pathway"]),
        "toxicity": float(result["toxicity"]),
        "cellular_response": float(result["cellular_response"]),
        "trajectory": [float(x) for x in result["trajectory"]]
    }

    return jsonify(result)

# ============================================================

if __name__ == "__main__":
    app.run(debug=True)
