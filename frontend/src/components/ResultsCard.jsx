import React from "react";

const shade = (val, max) => {
  if (max === 0) return "#f8f9fa";
  const intensity = Math.min(1, val / max);
  const alpha = 0.15 + 0.55 * intensity;
  return `rgba(46, 204, 113, ${alpha})`;
};

const ResultsCard = ({ result, model, splitInfo }) => {
  if (!result) {
    return (
      <div className="card card-step p-4 h-100">
        <h5 className="mb-1">Step 5 — Results</h5>
        <p className="text-muted small mb-0">Train a model to see metrics.</p>
      </div>
    );
  }

  const accuracyPct = (result.accuracy * 100).toFixed(2);
  const maxVal = Math.max(...result.confusion_matrix.flat());

  return (
    <div className="card card-step p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Step 5 — Results</h5>
          <p className="text-muted small mb-0">Status and performance at a glance.</p>
        </div>
        <span className="badge text-bg-success">Done</span>
      </div>
      <div className="mb-3 d-flex flex-wrap gap-2">
        <span className="summary-pill">Model: <strong>{model === "logistic" ? "Logistic Regression" : "Decision Tree"}</strong></span>
        <span className="summary-pill">Status: {result.status}</span>
      </div>
      <div className="mb-3">
        <label className="form-label">Accuracy</label>
        <div className="progress" style={{ height: "22px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${accuracyPct}%` }}
            aria-valuenow={accuracyPct}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {accuracyPct}%
          </div>
        </div>
      </div>
      <div>
        <h6 className="mt-3 mb-2">Confusion Matrix</h6>
        <div className="table-responsive">
          <table className="table table-sm mb-1">
            <tbody>
              {result.confusion_matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="cm-cell" style={{ background: shade(cell, maxVal) }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {splitInfo && (
          <p className="text-muted small mb-0">Train: {splitInfo.train_samples} | Test: {splitInfo.test_samples}</p>
        )}
      </div>
    </div>
  );
};

export default ResultsCard;