import React, { useState } from 'react';
import type { DailyLogInputs } from '../core/CarbonEngine';

interface InputFormProps {
  initialInputs: DailyLogInputs;
  onSubmit: (inputs: DailyLogInputs) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ initialInputs, onSubmit }) => {
  const [inputs, setInputs] = useState<DailyLogInputs>(initialInputs);

  const handleChange = (category: keyof DailyLogInputs, key: string, value: string) => {
    const numValue = Math.max(0, Number(value));
    setInputs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: numValue,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <section className="card" aria-labelledby="form-heading">
      <div className="card-header">
        <h2 id="form-heading">Log Today's Activity</h2>
      </div>

      <form id="footprint-form" onSubmit={handleSubmit}>
        <div className="section-group" role="group" aria-labelledby="transport-heading">
          <h3 id="transport-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🚗</span> Transportation</h3>
          <div className="input-grid">
            {Object.keys(inputs.transportation).map((key) => (
              <div className="input-group" key={`transportation-${key}`}>
                <label htmlFor={`transportation-${key}`}>{key.replace(/_/g, ' ')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    id={`transportation-${key}`}
                    value={inputs.transportation[key as keyof DailyLogInputs['transportation']] || ''}
                    onChange={(e) => handleChange('transportation', key, e.target.value)}
                    aria-label={`Distance for ${key.replace(/_/g, ' ')} in kilometers`}
                  />
                  <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>km</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-group" role="group" aria-labelledby="diet-heading">
          <h3 id="diet-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>🍽️</span> Diet</h3>
          <div className="input-grid">
            {Object.keys(inputs.diet).map((key) => (
              <div className="input-group" key={`diet-${key}`}>
                <label htmlFor={`diet-${key}`}>{key.replace(/_/g, ' ')}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    id={`diet-${key}`}
                    value={inputs.diet[key as keyof DailyLogInputs['diet']] || ''}
                    onChange={(e) => handleChange('diet', key, e.target.value)}
                    aria-label={`Servings of ${key.replace(/_/g, ' ')}`}
                  />
                  <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>srv</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-group" role="group" aria-labelledby="energy-heading">
          <h3 id="energy-heading" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span>⚡</span> Energy Usage</h3>
          <div className="input-grid">
            {Object.keys(inputs.energy).map((key) => {
              const unit = key.includes('laundry') ? 'loads' : 'hrs';
              return (
                <div className="input-group" key={`energy-${key}`}>
                  <label htmlFor={`energy-${key}`}>{key.replace(/_/g, ' ')}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0"
                      id={`energy-${key}`}
                      value={inputs.energy[key as keyof DailyLogInputs['energy']] || ''}
                      onChange={(e) => handleChange('energy', key, e.target.value)}
                      aria-label={`Usage amount for ${key.replace(/_/g, ' ')}`}
                    />
                    <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>{unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="submit" className="btn-primary" aria-label="Calculate your carbon footprint">
          Calculate Footprint
        </button>
      </form>
    </section>
  );
};
