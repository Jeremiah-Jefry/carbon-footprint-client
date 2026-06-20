import React from 'react';
import { constants, CarbonEngine } from '@carbon/emissions-engine';

interface PersonalizedInsightCardProps {
  highestCategory: string | null;
  highestKey: string | null;
}

export const PersonalizedInsightCard: React.FC<PersonalizedInsightCardProps> = ({ highestKey }) => {
  const engine = new CarbonEngine(
    constants.baseline_emission_factors_kg_co2e,
    constants.behavioral_nudges,
    constants.relatable_equivalents_per_1_kg_co2e
  );

  // We mock a DailyLogInputs based just on the dominant key to leverage the engine
  const mockLog: any = { transportation: {}, diet: {}, energy: {} };
  if (highestKey) {
     const [cat] = highestKey.split('_', 2);
     const activityName = highestKey.substring(cat.length + 1);
     if (cat && activityName && mockLog[cat]) {
        mockLog[cat][activityName] = 1;
     }
  }

  const insight = engine.getPersonalizedInsight(mockLog);

  return (
    <div className="app-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
        <span style={{ fontSize: '1.2em' }}>💡</span> Smart Insight
      </h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        {insight}
      </p>
    </div>
  );
};
