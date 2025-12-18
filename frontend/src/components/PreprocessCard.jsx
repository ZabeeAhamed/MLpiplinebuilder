import React, { useState } from "react";
import { preprocess } from "../api";

const PreprocessCard = ({ sessionId, columns, onComplete, disabled }) => {
  const [standardize, setStandardize] = useState(false);
  const [normalize, setNormalize] = useState(false);
  const [target, setTarget] = useState("");
  const [info, setInfo] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr("");
    if (!target) return setErr("Select a target column.");
    setLoading(true);
    try {
      const res = await preprocess({ session_id: sessionId, standardize, normalize, target });
      setInfo(res.data);
      onComplete(res.data, { standardize, normalize, target });
    } catch (e) {
      setErr(e.response?.data?.detail || "Preprocess failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card card-step p-4 h-100 ${disabled ? "opacity-50" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Step 2 — Preprocessing</h5>
          <p className="text-muted small mb-0">Choose transforms (order: Standardize → Normalize). Pick target.</p>
        </div>
        {info && <span className="badge text-bg-success">Completed</span>}
      </div>
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" id="std" checked={standardize} onChange={e => setStandardize(e.target.checked)} disabled={disabled}/>
        <label className="form-check-label" htmlFor="std">Standardization (StandardScaler)</label>
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="norm" checked={normalize} onChange={e => setNormalize(e.target.checked)} disabled={disabled}/>
        <label className="form-check-label" htmlFor="norm">Normalization (MinMaxScaler)</label>
      </div>
      <div className="mb-3">
        <label className="form-label">Target column</label>
        <select className="form-select" value={target} onChange={(e) => setTarget(e.target.value)} disabled={disabled}>
          <option value="">Select target</option>
          {columns.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <button className="btn btn-primary w-100" onClick={handle} disabled={disabled || loading}>
        {loading ? "Applying..." : "Apply Preprocessing"}
      </button>
      {err && <div className="alert alert-danger mt-3 py-2">{err}</div>}
      {info && (
        <div className="mt-3 d-flex flex-wrap gap-2">
          <span className="badge-soft">Transforms: {standardize ? "Standardize" : ""}{standardize && normalize ? " + " : ""}{normalize ? "Normalize" : ( !standardize ? "None" : "")}</span>
          <span className="badge-soft">Target: {target}</span>
          <span className="badge-soft">Columns: {info.columns.length}</span>
        </div>
      )}
    </div>
  );
};

export default PreprocessCard;