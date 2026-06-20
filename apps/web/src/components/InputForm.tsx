import React, { useState } from 'react';
import type { DailyLogInputs } from '@carbon/emissions-engine';

interface InputFormProps {
  initialInputs: DailyLogInputs;
  onSubmit: (inputs: DailyLogInputs) => void;
}

export const ACTIVITY_ICONS: Record<string, string> = {
  transportation: '🚗',
  diet: '🍔',
  energy: '⚡'
};

export const InputForm: React.FC<InputFormProps> = ({ initialInputs, onSubmit }) => {
  const [inputs, setInputs] = useState<DailyLogInputs>(initialInputs);

  const handleSliderChange = (category: keyof DailyLogInputs, activity: string, value: number) => {
    setInputs((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [activity]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form className="app-card" onSubmit={handleSubmit} style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: 'linear-gradient(90deg, #00e676, transparent)', opacity: 0.3
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2em' }}>📝</span> Daily Log
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Updated Live</span>
      </div>

      <div className="form-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-green)' }}>{ACTIVITY_ICONS.transportation}</span> Transportation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(inputs.transportation).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label htmlFor={`transport-${key}`} style={{ width: '120px', fontSize: '14px', textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </label>
              <input
                id={`transport-${key}`}
                type="range" min="0" max="100" value={val}
                onChange={(e) => handleSliderChange('transportation', key, Number(e.target.value))}
                style={{ flex: 1 }}
                aria-label={`Transportation distance for ${key.replace('_', ' ')}`}
              />
              <span style={{ width: '40px', fontSize: '14px', textAlign: 'right', fontFamily: 'monospace' }}>
                {val}km
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-green)' }}>{ACTIVITY_ICONS.diet}</span> Diet
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(inputs.diet).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label htmlFor={`diet-${key}`} style={{ width: '120px', fontSize: '14px', textTransform: 'capitalize' }}>
                {key.replace('_', ' ')}
              </label>
              <input
                id={`diet-${key}`}
                type="range" min="0" max="5" value={val} step="1"
                onChange={(e) => handleSliderChange('diet', key, Number(e.target.value))}
                style={{ flex: 1 }}
                aria-label={`Diet servings for ${key.replace('_', ' ')}`}
              />
              <span style={{ width: '60px', fontSize: '14px', textAlign: 'right', fontFamily: 'monospace' }}>
                {val} srv
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-green)' }}>{ACTIVITY_ICONS.energy}</span> Energy
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(inputs.energy).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <label htmlFor={`energy-${key}`} style={{ width: '120px', fontSize: '14px', textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}
              </label>
              <input
                id={`energy-${key}`}
                type="range" min="0" max="12" value={val} step="1"
                onChange={(e) => handleSliderChange('energy', key, Number(e.target.value))}
                style={{ flex: 1 }}
                aria-label={`Energy use for ${key.replace(/_/g, ' ')}`}
              />
              <span style={{ width: '40px', fontSize: '14px', textAlign: 'right', fontFamily: 'monospace' }}>
                {val}h/l
              </span>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="calculate-btn">
        Calculate Footprint
      </button>
    </form>
  );
};
