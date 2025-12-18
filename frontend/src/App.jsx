import React, { useState } from "react";
import Stepper from "./components/Stepper";
import UploadCard from "./components/UploadCard";
import PreprocessCard from "./components/PreprocessCard";
import SplitCard from "./components/SplitCard";
import ModelCard from "./components/ModelCard";
import ResultsCard from "./components/ResultsCard";

const steps = [
  "Upload Dataset",
  "Preprocessing",
  "Train/Test Split",
  "Model Selection",
  "Results"
];

const App = () => {
  const [session, setSession] = useState(null);
  const [columns, setColumns] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [splitInfo, setSplitInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [modelChoice, setModelChoice] = useState(null);

  return (
    <div className="container-max py-4">
      <div className="glass-shell mb-4">
        <div className="row align-items-center g-3">
          <div className="col-lg-8">
            <h1 className="hero-title mb-2">No-Code ML Pipeline Builder</h1>
            <p className="hero-sub mb-0">
              Build and run an end-to-end ML workflow without code. Guided steps, clean visuals, instant feedback.
            </p>
          </div>
          
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="card card-step p-3 h-100">
            <Stepper steps={steps} active={activeStep} />
          </div>
        </div>
        <div className="col-lg-9">
          <div className="row g-3">
            <div className="col-md-6">
              <UploadCard
                onComplete={(data) => {
                  setSession(data.session_id);
                  setColumns(data.columns);
                  setActiveStep(1);
                  setResult(null);
                }}
              />
            </div>
            <div className="col-md-6">
              <PreprocessCard
                sessionId={session}
                columns={columns}
                disabled={!session}
                onComplete={() => {
                  setActiveStep(2);
                  setResult(null);
                }}
              />
            </div>
            <div className="col-md-6">
              <SplitCard
                sessionId={session}
                disabled={activeStep < 2}
                onComplete={(data) => {
                  setSplitInfo(data);
                  setActiveStep(3);
                  setResult(null);
                }}
              />
            </div>
            <div className="col-md-6">
              <ModelCard
                sessionId={session}
                disabled={activeStep < 3}
                onComplete={(data, model) => {
                  setModelChoice(model);
                  setResult(data);
                  setActiveStep(4);
                }}
              />
            </div>
            <div className="col-12">
              <ResultsCard result={result} model={modelChoice} splitInfo={splitInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;