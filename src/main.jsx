import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
Activity,
ArrowRight,
BrainCircuit,
CheckCircle2,
CircleAlert,
Clock3,
HeartPulse,
LoaderCircle,
RotateCcw,
ShieldCheck,
Sparkles,
Stethoscope,
Thermometer,
X,
} from "lucide-react";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const symptomSuggestions = [
"Fever",
"Headache",
"Fatigue",
"Nausea",
"Cough",
"Dizziness",
"Joint pain",
"Sore throat",
];

function App() {
const [symptoms, setSymptoms] = useState("");
const [result, setResult] = useState(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const addSymptom = (symptom) => {
const existing = symptoms
.split(",")
.map((item) => item.trim().toLowerCase())
.filter(Boolean);

```
if (existing.includes(symptom.toLowerCase())) return;

setSymptoms((current) =>
  current.trim()
    ? `${current.trim().replace(/,+$/, "")}, ${symptom}`
    : symptom
);
setError("");
```

};

const clearForm = () => {
setSymptoms("");
setResult(null);
setError("");
};

const handlePredict = async (event) => {
event.preventDefault();
setResult(null);
setError("");

```
if (!symptoms.trim()) {
  setError("Enter at least one symptom to continue.");
  return;
}

if (!API_URL) {
  setError(
    "The inference backend is not connected yet. The interface is ready, but predictions require a running model API."
  );
  return;
}

setLoading(true);

try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms: symptoms.trim() }),
  });

  if (!response.ok) {
    throw new Error(`The prediction service returned status ${response.status}.`);
  }

  const data = await response.json();
  setResult(data);
} catch (err) {
  setError(
    err.message ||
      "Could not connect to the prediction service. Please try again."
  );
} finally {
  setLoading(false);
}
```

};

return ( <div className="app-shell"> <div className="ambient ambient-one" /> <div className="ambient ambient-two" />

```
  <header className="topbar">
    <a className="brand" href="#home" aria-label="SymptomScope home">
      <span className="brand-icon">
        <Activity size={22} strokeWidth={2.5} />
      </span>
      <span>
        <span className="brand-name">
          SymptomScope<span className="brand-dot">.</span>
        </span>
        <span className="brand-caption">LLM RESEARCH PROJECT</span>
      </span>
    </a>

    <div className="topbar-right">
      <span className="status-pill">
        <span className="status-dot" />
        Experimental build
      </span>
      <a className="github-link" href="#about">
        About project <ArrowRight size={15} />
      </a>
    </div>
  </header>

  <main id="home">
    <section className="hero">
      <div className="eyebrow">
        <Sparkles size={14} />
        EXPLORING LANGUAGE MODELS IN HEALTHCARE
      </div>

      <h1>
        Understand your symptoms.
        <br />
        <span>Explore the possibilities.</span>
      </h1>

      <p className="hero-description">
        An experimental symptom-classification system exploring what a
        fine-tuned language model can learn from symptom descriptions.
      </p>

      <div className="hero-meta">
        <span>
          <BrainCircuit size={16} />
          Fine-tuned Qwen2.5
        </span>
        <span className="meta-divider" />
        <span>
          <Activity size={16} />
          254 disease labels
        </span>
        <span className="meta-divider" />
        <span>
          <ShieldCheck size={16} />
          Academic research
        </span>
      </div>
    </section>

    <section className="workspace">
      <div className="form-panel panel">
        <div className="panel-heading">
          <div className="heading-icon">
            <Stethoscope size={21} />
          </div>
          <div>
            <h2>Symptom assessment</h2>
            <p>Describe what you are experiencing.</p>
          </div>
          <span className="step-label">01 / INPUT</span>
        </div>

        <form onSubmit={handlePredict}>
          <label className="field-label" htmlFor="symptoms">
            YOUR SYMPTOMS
            <span>Be as descriptive as you can</span>
          </label>

          <div className="textarea-wrap">
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(event) => {
                setSymptoms(event.target.value);
                setError("");
              }}
              placeholder="For example: I have had a fever and headache for two days, along with fatigue..."
              rows={6}
              maxLength={3000}
            />
            <div className="textarea-footer">
              <span>
                <HeartPulse size={14} />
                Include duration and severity if known
              </span>
              <span>{symptoms.length}/3000</span>
            </div>
          </div>

          <div className="suggestions-heading">
            <span>QUICK ADD</span>
            <span>Tap to add a symptom</span>
          </div>

          <div className="symptom-chips">
            {symptomSuggestions.map((symptom) => (
              <button
                className="symptom-chip"
                type="button"
                key={symptom}
                onClick={() => addSymptom(symptom)}
              >
                <span>+</span>
                {symptom}
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message" role="alert">
              <CircleAlert size={17} />
              <span>{error}</span>
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setError("")}
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="form-actions">
            <button
              className="clear-button"
              type="button"
              onClick={clearForm}
              disabled={loading}
            >
              <RotateCcw size={15} />
              Clear
            </button>

            <button
              className="predict-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  Analysing symptoms...
                </>
              ) : (
                <>
                  Explore classification
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="privacy-note">
          <ShieldCheck size={16} />
          <p>
            Avoid entering names, addresses, or other personally
            identifying information.
          </p>
        </div>
      </div>

      <aside className="results-column">
        <div className="result-panel panel">
          <div className="panel-heading">
            <div className="heading-icon result-icon">
              <BrainCircuit size={21} />
            </div>
            <div>
              <h2>Model output</h2>
              <p>Classification results appear here.</p>
            </div>
          </div>

          {result ? (
            <div className="result-content">
              <div className="result-success">
                <CheckCircle2 size={18} />
                Response received from the model API
              </div>
              <pre className="result-json">
                {JSON.stringify(result, null, 2)}
              </pre>
              <p className="result-disclaimer">
                Model output is experimental and is not a confirmed
                diagnosis.
              </p>
            </div>
          ) : (
            <div className="empty-result">
              <div className="empty-illustration">
                <div className="illustration-ring ring-one" />
                <div className="illustration-ring ring-two" />
                <div className="illustration-core">
                  <BrainCircuit size={35} />
                </div>
                <span className="float-icon float-one">
                  <Activity size={16} />
                </span>
                <span className="float-icon float-two">
                  <Thermometer size={16} />
                </span>
              </div>

              <h3>Waiting for input</h3>
              <p>
                Add your symptoms and submit them to see the response
                returned by the classification model.
              </p>

              <div className="result-placeholder">
                <span className="placeholder-indicator" />
                <span>Predicted label</span>
                <span className="placeholder-line" />
              </div>
              <div className="result-placeholder">
                <span className="placeholder-indicator" />
                <span>Model score</span>
                <span className="placeholder-line short" />
              </div>
            </div>
          )}

          <div className="result-footer">
            <span>
              <Clock3 size={14} />
              Results depend on the connected model
            </span>
          </div>
        </div>

        <div className="notice-card">
          <div className="notice-icon">
            <ShieldCheck size={19} />
          </div>
          <div>
            <h3>Research, not diagnosis</h3>
            <p>
              This tool is a student research demonstration. It cannot
              diagnose conditions, replace a clinician, or determine
              treatment. Seek professional care for medical concerns.
            </p>
          </div>
        </div>
      </aside>
    </section>

    <section className="project-strip" id="about">
      <div className="project-strip-icon">
        <BrainCircuit size={22} />
      </div>
      <div className="project-strip-copy">
        <span className="strip-overline">UNDER THE HOOD</span>
        <h2>Built to explore fine-tuning</h2>
        <p>
          SymptomScope investigates how parameter-efficient fine-tuning
          can adapt a language model to a symptom-classification task.
        </p>
      </div>
      <div className="project-stats">
        <div>
          <strong>Qwen2.5</strong>
          <span>Base model family</span>
        </div>
        <div>
          <strong>LoRA</strong>
          <span>Fine-tuning method</span>
        </div>
        <div>
          <strong>254</strong>
          <span>Target labels</span>
        </div>
      </div>
    </section>

    <footer className="footer">
      <a className="footer-brand" href="#home">
        SymptomScope<span>.</span>
      </a>
      <p>Built as an academic LLM Engineering project.</p>
      <span className="footer-disclaimer">
        Not intended for medical use.
      </span>
    </footer>
  </main>
</div>
```

);
}

createRoot(document.getElementById("root")).render(<App />);
