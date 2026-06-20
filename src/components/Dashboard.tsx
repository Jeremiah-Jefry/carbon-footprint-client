import React, { useEffect, useState } from 'react';
import { ImpactTranslator } from './ImpactTranslator';
import { PersonalizedInsightCard } from './PersonalizedInsightCard';
import { GLOBAL_DAILY_AVERAGE_KG } from '../data/emissionFactors';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  totalKgCO2e: number;
  insight?: string;
  dominantCategory: string | null;
  dominantKey: string | null;
  xpEarned?: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalKgCO2e, dominantCategory, dominantKey, xpEarned = 0 }) => {
  const [displayTotal, setDisplayTotal] = useState(0);
  const [showXP, setShowXP] = useState(false);

  useEffect(() => {
    // Simple counter animation
    if (totalKgCO2e === 0) {
      setDisplayTotal(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplayTotal((totalKgCO2e / steps) * currentStep);
      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayTotal(totalKgCO2e);
        if (xpEarned > 0) {
          setShowXP(true);
          setTimeout(() => setShowXP(false), 2500);
        }
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalKgCO2e, xpEarned]);

  const diffPercent = Math.round(Math.abs((totalKgCO2e - GLOBAL_DAILY_AVERAGE_KG) / GLOBAL_DAILY_AVERAGE_KG) * 100);
  const isBelowAverage = totalKgCO2e < GLOBAL_DAILY_AVERAGE_KG;

  let colorClass = 'text-green';
  let glowColor = 'rgba(0, 230, 118, 0.4)';
  if (totalKgCO2e >= 6 && totalKgCO2e <= 12) { colorClass = 'text-amber'; glowColor = 'rgba(255, 179, 0, 0.4)'; }
  if (totalKgCO2e > 12) { colorClass = 'text-red'; glowColor = 'rgba(239, 83, 80, 0.4)'; }

  return (
    <aside className="sidebar">
      <div className="card dashboard-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 60%)`, opacity: 0.15, zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Total Daily Footprint</h2>

          <div className="footprint-number">
            <span className={colorClass} style={{ transition: 'all 0.3s ease', textShadow: `0 0 30px ${glowColor}` }}>{displayTotal.toFixed(2)}</span>
            <small>kg CO₂e</small>
          </div>

        {totalKgCO2e > 0 && (
          <div style={{
            color: isBelowAverage ? 'var(--accent-green)' : 'var(--accent-red)',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginTop: '-16px',
            marginBottom: '16px'
          }}>
            {isBelowAverage ? `↓ ${diffPercent}% below global average` : `↑ ${diffPercent}% above global average`}
          </div>
        )}

        <AnimatePresence>
          {showXP && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'var(--accent-green)',
                fontWeight: 800,
                fontSize: '1.5rem',
                textShadow: '0 0 10px rgba(0, 230, 118, 0.5)',
                zIndex: 10
              }}
            >
              +{xpEarned} XP
            </motion.div>
          )}
        </AnimatePresence>

        {totalKgCO2e > 0 && <ImpactTranslator totalKgCO2e={totalKgCO2e} />}
        </div>
      </div>

      {totalKgCO2e > 0 && (
        <PersonalizedInsightCard highestCategory={dominantCategory} highestKey={dominantKey} />
      )}
    </aside>
  );
};
