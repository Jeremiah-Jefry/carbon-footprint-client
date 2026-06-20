import React from 'react';
import { motion } from 'framer-motion';

interface ImpactTranslatorProps {
  totalKgCO2e: number;
}

export const ImpactTranslator: React.FC<ImpactTranslatorProps> = ({ totalKgCO2e }) => {
  // RELATABLE_EQUIVALENTS values:
  const smartphone_charges = Math.round(totalKgCO2e * 121.65);
  const miles_driven = (totalKgCO2e * 2.48).toFixed(1);
  const tree_days = (totalKgCO2e * 16.6).toFixed(1);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" }
    })
  } as any;

  const cards = [
    { icon: '🔋', title: 'Smartphone Charges', value: `${smartphone_charges} times` },
    { icon: '🚗', title: 'Gas Car Driving', value: `${miles_driven} miles` },
    { icon: '🌳', title: 'Tree Absorption', value: `${tree_days} days` },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginTop: '24px' }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          style={{
            backgroundColor: 'var(--bg-highlight)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '2rem' }}>{card.icon}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.title}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{card.value}</div>
        </motion.div>
      ))}
    </div>
  );
};
