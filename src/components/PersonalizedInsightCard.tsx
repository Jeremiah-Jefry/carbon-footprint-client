import React from 'react';
import { BEHAVIORAL_NUDGES } from '../data/emissionFactors';

interface PersonalizedInsightCardProps {
  highestCategory: string | null;
  highestKey: string | null;
}

export const PersonalizedInsightCard: React.FC<PersonalizedInsightCardProps> = ({ highestCategory, highestKey }) => {
  let nudge = BEHAVIORAL_NUDGES.find(n => n.triggerIfHigh === highestKey?.split('_').slice(1).join('_'));

  // fallback based on category
  if (!nudge && highestCategory) {
     nudge = BEHAVIORAL_NUDGES.find(n => n.category === highestCategory);
  }

  // global fallback
  if (!nudge) {
    nudge = BEHAVIORAL_NUDGES.find(n => n.triggerIfHigh === null) || BEHAVIORAL_NUDGES[0];
  }

  return (
    <div className="insight-card" style={{ textAlign: 'left' }}>
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#00e676',
        marginBottom: '8px',
        fontWeight: 600
      }}>
        💡 TODAY'S INSIGHT
      </div>
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
        {nudge.action}
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
        {nudge.insight}
      </p>
    </div>
  );
};
