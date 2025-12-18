import React, { useState } from "react";
import { trainModel } from "../api";

const ModelCard = ({ sessionId, onComplete, disabled }) => {
  const [model, setModel] = useState("logistic");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await trainModel({ session_id: sessionId, model });
      onComplete(res.data, model);
    } catch (e) {
      setErr(e.response?.data?.detail || "Training failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card card-step p-4 h-100 ${disabled ? "opacity-50" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Step 4 — Model Selection</h5>
          <p className="text-muted small mb-0">Pick one model and run the pipeline.</p>
        </div>
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input" type="radio" name="model" id="logistic" value="logistic"
          checked={model === "logistic"} onChange={() => setModel("logistic")} disabled={disabled}/>
        <label className="form-check-label" htmlFor="logistic">Logistic Regression</label>
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="radio" name="model" id="dt" value="decision_tree"
          checked={model === "decision_tree"} onChange={() => setModel("decision_tree")} disabled={disabled}/>
        <label className="form-check-label" htmlFor="dt">Decision Tree Classifier</label>
      </div>
      <button className="btn btn-primary w-100" onClick={handle} disabled={disabled || loading}>
        {loading ? "Training..." : "Run Pipeline"}
      </button>
      {err && <div className="alert alert-danger mt-3 py-2">{err}</div>}
    </div>
  );
};

export default ModelCard;