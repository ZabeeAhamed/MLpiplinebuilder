import React, { useState } from "react";
import { uploadFile } from "../api";

const UploadCard = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleUpload = async () => {
    setErr("");
    if (!file) return setErr("Please select a CSV or Excel file.");
    setLoading(true);
    try {
      const res = await uploadFile(file);
      setInfo(res.data);
      onComplete(res.data);
    } catch (e) {
      setErr(e.response?.data?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-step p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Step 1 — Upload Dataset</h5>
          <p className="text-muted small mb-0">Upload CSV/XLSX. We’ll show a quick preview.</p>
        </div>
        {info && <span className="badge text-bg-success">Completed</span>}
      </div>
      <input
        type="file"
        className="form-control mb-3"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button className="btn btn-primary w-100" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {err && <div className="alert alert-danger mt-3 py-2">{err}</div>}
      {info && (
        <div className="mt-3">
          <div className="d-flex flex-wrap gap-2 mb-2">
            <span className="summary-pill">Rows: <strong>{info.rows}</strong></span>
            <span className="summary-pill">Columns: <strong>{info.cols}</strong></span>
            <span className="summary-pill">Numeric: <strong>{info.numeric_cols}</strong></span>
            <span className="summary-pill">Non-numeric: <strong>{info.non_numeric_cols}</strong></span>
          </div>
          <div className="text-muted small mb-2">Column headers: {info.columns.join(", ")}</div>
          <div className="preview-table">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  {info.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {info.preview.map((row, i) => (
                  <tr key={i}>
                    {info.columns.map((c) => (
                      <td key={c}>{row[c]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;