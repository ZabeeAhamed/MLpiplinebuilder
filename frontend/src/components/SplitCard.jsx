import React, { useState } from "react";
import { splitData } from "../api";

const SplitCard = ({ sessionId, onComplete, disabled }) => {
  const [ratio, setRatio] = useState(0.2);
  const [info, setInfo] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await splitData({ session_id: sessionId, test_size: Number(ratio) });
      setInfo(res.data);
      onComplete(res.data, ratio);
    } catch (e) {
      setErr(e.response?.data?.detail || "Split failed.");
    } finally {
      setLoading(false);
    }
  };

  const trainPct = Math.round((1 - Number(ratio)) * 100);
  const testPct = Math.round(Number(ratio) * 100);

  return (
    <div className={`card card-step p-4 h-100 ${disabled ? "opacity-50" : ""}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Step 3 — Train/Test Split</h5>
          <p className="text-muted small mb-0">Pick a ratio; we’ll stratify if possible.</p>
        </div>
        {info && <span className="badge text-bg-success">Completed</span>}
      </div>
      <select className="form-select mb-3" value={ratio} onChange={(e) => setRatio(e.target.value)} disabled={disabled}>
        <option value={0.2}>Train 80% / Test 20%</option>
        <option value={0.3}>Train 70% / Test 30%</option>
        <option value={0.4}>Train 60% / Test 40%</option>
      </select>
      <div className="split-bar mb-3">
        <div className="train" style={{ width: `${trainPct}%` }}></div>
        <div className="test" style={{ width: `${testPct}%` }}></div>
      </div>
      <div className="d-flex justify-content-between text-muted small mb-3">
        <span>Train: {trainPct}%</span>
        <span>Test: {testPct}%</span>
      </div>
      <button className="btn btn-primary w-100" onClick={handle} disabled={disabled || loading}>
        {loading ? "Splitting..." : "Split Data"}
      </button>
      {err && <div className="alert alert-danger mt-3 py-2">{err}</div>}
      {info && (
        <div className="mt-3 d-flex gap-2">
          <div className="summary-pill">Train: <strong>{info.train_samples}</strong></div>
          <div className="summary-pill">Test: <strong>{info.test_samples}</strong></div>
        </div>
      )}
    </div>
  );
};

export default SplitCard;