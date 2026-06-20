import React from 'react';

interface ImpactTranslatorProps {
  totalKgCO2e: number;
}

export const ImpactTranslator: React.FC<ImpactTranslatorProps> = ({ totalKgCO2e }) => {
  // RELATABLE_EQUIVALENTS values:
  const smartphone_charges = (totalKgCO2e * 121.65).toFixed(0);
  const miles_driven = (totalKgCO2e * 2.48).toFixed(1);
  const tree_days = (totalKgCO2e * 16.6).toFixed(1);

  const cards = [
    { icon: '🔋', value: smartphone_charges, label: 'phone charges' },
    { icon: '🚗', value: miles_driven, label: 'miles in a gas car' },
    { icon: '🌳', value: tree_days, label: 'days for a tree to absorb' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', textAlign: 'left' }}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="impact-card"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <div style={{ fontSize: '24px' }}>{card.icon}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: '16px' }}>{card.value}</strong> {card.label}
          </div>
        </div>
      ))}
    </div>
  );
};
