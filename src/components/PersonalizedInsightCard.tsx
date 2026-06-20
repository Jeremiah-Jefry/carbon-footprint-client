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
    <div className="card insight-card" style={{ marginTop: '24px', padding: 0 }}>
      <div className="insight-content" style={{ padding: '32px' }}>
        <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💡</span> TIP
        </div>
        <h2>{nudge.action}</h2>
        <p>{nudge.insight}</p>
      </div>
    </div>
  );
};
