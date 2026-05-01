import type { StepInstruction } from '../types/ads';

interface Props {
  steps: StepInstruction[];
  platformColor: string;
}

export function StepList({ steps, platformColor }: Props) {
  return (
    <div className="step-list">
      {steps.map((step) => (
        <div key={step.step} className="step-card">
          <div className="step-header">
            <span className="step-number" style={{ background: platformColor }}>
              {step.step}
            </span>
            <h3 className="step-title">{step.title}</h3>
          </div>

          {step.url && (
            <div className="step-url">
              <span className="field-label">URL: </span>
              <a href={step.url} target="_blank" rel="noreferrer" className="step-link">
                {step.url}
              </a>
            </div>
          )}

          {step.fields.length > 0 && (
            <div className="step-fields">
              {step.fields.map((f) => (
                <div key={f.label} className="step-field">
                  <span className="field-label">{f.label}:</span>
                  <span className="field-value">{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {step.notes && step.notes.length > 0 && (
            <ul className="step-notes">
              {step.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
