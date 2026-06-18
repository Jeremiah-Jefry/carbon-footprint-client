import React from 'react';
import type { EquivalentResult } from '../core/CarbonEngine';

interface DashboardProps {
  totalKgCO2e: number;
  equivalents: EquivalentResult;
  insight: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalKgCO2e, equivalents, insight }) => {
  return (
    <aside className="sidebar" aria-label="Dashboard Sidebar">
      <div className="card dashboard-card">
        <h2>Daily Dashboard</h2>
        <div className="footprint-number" aria-live="polite">
          <span>{totalKgCO2e.toFixed(2)}</span>
          <small>kg CO₂e</small>
        </div>
        <div className="equivalents" aria-live="polite">
          {totalKgCO2e > 0 ? (
            <>
              <p>📱 ≈ {equivalents.smartphoneCharges} smartphone charges</p>
              <p>🚗 ≈ {equivalents.milesDrivenGasCar} miles driven in a gas car</p>
              <p>🌳 ≈ {equivalents.daysTreeAbsorption} days of tree absorption</p>
            </>
          ) : (
            <p>Start logging activities to see your impact.</p>
          )}
        </div>
      </div>

      <div className="card insight-card">
        <div className="insight-content">
          <h2>Your Daily Mix</h2>
          <p aria-live="polite">{insight}</p>
        </div>
      </div>
    </aside>
  );
};
