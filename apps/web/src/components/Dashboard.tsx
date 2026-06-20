import React from 'react';
import { PersonalizedInsightCard } from './PersonalizedInsightCard';
import { ImpactTranslator } from './ImpactTranslator';
import type { Breakdown } from '@carbon/emissions-engine';
import { ACTIVITY_ICONS } from './InputForm';

interface DashboardProps {
  totalKgCO2e: number;
  breakdown: Breakdown;
  dominantCategory: string | null;
  dominantKey: string | null;
  xpEarned: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalKgCO2e, breakdown, dominantCategory, dominantKey, xpEarned }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px' }}>
        <div>
          <h2 style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Daily Footprint</h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: 1 }}>{totalKgCO2e}</span>
            <span style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>kg CO₂e</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '140px' }}>
          {Object.entries(breakdown).map(([cat, val]) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                <span>{ACTIVITY_ICONS[cat]}</span> {cat}
              </span>
              <span style={{ fontWeight: '500' }}>{val} kg</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <PersonalizedInsightCard highestCategory={dominantCategory} highestKey={dominantKey} />
        <ImpactTranslator totalKgCO2e={totalKgCO2e} />
      </div>

      {xpEarned > 0 && (
         <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 'bold' }}>
            +{xpEarned} XP Earned Today!
         </div>
      )}
    </div>
  );
};
