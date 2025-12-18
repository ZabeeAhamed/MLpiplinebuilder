import React from "react";

const Stepper = ({ steps, active }) => {
  return (
    <div className="d-flex flex-column align-items-start">
      {steps.map((label, idx) => (
        <div className="d-flex align-items-center mb-2" key={label}>
          <div className={`step-badge ${idx < active ? "done" : ""}`}>
            {idx < active ? "✔" : idx + 1}
          </div>
          <div className="ms-2 fw-semibold">{label}</div>
          {idx !== steps.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default Stepper;