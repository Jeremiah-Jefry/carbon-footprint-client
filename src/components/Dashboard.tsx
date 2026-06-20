import React, { useEffect, useState, useRef } from 'react';
import { ImpactTranslator } from './ImpactTranslator';
import { PersonalizedInsightCard } from './PersonalizedInsightCard';
import { GLOBAL_DAILY_AVERAGE_KG } from '../data/emissionFactors';
import type { Breakdown } from '../core/CarbonEngine';

interface DashboardProps {
  totalKgCO2e: number;
  breakdown?: Breakdown;
  insight?: string;
  dominantCategory: string | null;
  dominantKey: string | null;
  xpEarned?: number;
}

function getGrade(kg: number) {
  if (kg <= 2) return { grade: 'A+', label: 'Carbon Hero', color: '#00e676' };
  if (kg <= 5) return { grade: 'A', label: 'Excellent', color: '#00c853' };
  if (kg <= 8) return { grade: 'B', label: 'Good', color: '#76ff03' };
  if (kg <= 12) return { grade: 'C', label: 'Average', color: '#ffd600' };
  if (kg <= 18) return { grade: 'D', label: 'Above Average', color: '#ff6d00' };
  return { grade: 'F', label: 'High Impact', color: '#ef5350' };
}

export const Dashboard: React.FC<DashboardProps> = ({ totalKgCO2e, breakdown, dominantCategory, dominantKey, xpEarned = 0 }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const [showXP, setShowXP] = useState(false);
  const [fillBars, setFillBars] = useState(false);

  useEffect(() => {
    if (totalKgCO2e === 0) {
      if (numberRef.current) numberRef.current.textContent = "0.00";
      setFillBars(false);
      return;
    }

    const start = performance.now();
    const duration = 1500;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      if (numberRef.current) {
        numberRef.current.textContent = (totalKgCO2e * eased).toFixed(2);
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    // Trigger bar fill after a tiny delay
    setTimeout(() => setFillBars(true), 100);

    if (xpEarned > 0) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 2500);
    }
  }, [totalKgCO2e, xpEarned]);

  const diffPercent = Math.round(Math.abs((totalKgCO2e - GLOBAL_DAILY_AVERAGE_KG) / GLOBAL_DAILY_AVERAGE_KG) * 100);
  const isBelowAverage = totalKgCO2e < GLOBAL_DAILY_AVERAGE_KG;
  const gradeInfo = getGrade(totalKgCO2e);

  return (
    <aside className="sidebar">
      <div className="app-card dashboard-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: `radial-gradient(circle at center, ${gradeInfo.color}40 0%, transparent 60%)`, opacity: 0.15, zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '8px' }}>Total Daily Footprint</h2>

          {totalKgCO2e > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '64px', fontWeight: 800, color: gradeInfo.color, lineHeight: 1, fontFamily: 'var(--font-display)', textShadow: `0 0 30px ${gradeInfo.color}66` }}>
                {gradeInfo.grade}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {gradeInfo.label}
              </div>
              <div style={{
                color: isBelowAverage ? '#00e676' : (totalKgCO2e <= 12 ? '#ffb300' : '#ef5350'),
                fontWeight: 600,
                fontSize: '12px',
                marginTop: '8px'
              }}>
                {isBelowAverage ? `↓ ${diffPercent}% below global average` : `↑ ${diffPercent}% above global average`}
              </div>
            </div>
          )}

          <div className="footprint-number" style={{ margin: totalKgCO2e > 0 ? '16px 0 24px' : '24px 0' }}>
            <span ref={numberRef} style={{ color: totalKgCO2e > 0 ? 'white' : 'var(--text-secondary)', transition: 'color 0.3s ease', fontSize: '3.5rem', fontWeight: 900, display: 'block', lineHeight: 1 }}>
              0.00
            </span>
            <small style={{ color: 'var(--text-secondary)' }}>kg CO₂e</small>
          </div>

          {totalKgCO2e > 0 && breakdown && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', marginBottom: '16px', textAlign: 'left' }}>
              <div className="breakdown-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="breakdown-label" style={{ fontSize: '12px', width: '80px', color: '#e0e0e0' }}>🚗 Transport</span>
                <div className="breakdown-track" style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div className="breakdown-fill" style={{
                    height: '100%',
                    width: fillBars ? `${(breakdown.transportation / totalKgCO2e * 100)}%` : '0%',
                    background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
                    transition: 'width 1s ease 0.3s',
                    borderRadius: '999px'
                  }} />
                </div>
                <span className="breakdown-value" style={{ fontSize: '12px', color: 'var(--text-secondary)', width: '45px', textAlign: 'right' }}>
                  {breakdown.transportation.toFixed(2)} kg
                </span>
              </div>
              <div className="breakdown-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="breakdown-label" style={{ fontSize: '12px', width: '80px', color: '#e0e0e0' }}>🍽️ Diet</span>
                <div className="breakdown-track" style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div className="breakdown-fill" style={{
                    height: '100%',
                    width: fillBars ? `${(breakdown.diet / totalKgCO2e * 100)}%` : '0%',
                    background: 'linear-gradient(90deg, #2e7d32, #66bb6a)',
                    transition: 'width 1s ease 0.5s',
                    borderRadius: '999px'
                  }} />
                </div>
                <span className="breakdown-value" style={{ fontSize: '12px', color: 'var(--text-secondary)', width: '45px', textAlign: 'right' }}>
                  {breakdown.diet.toFixed(2)} kg
                </span>
              </div>
              <div className="breakdown-bar-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="breakdown-label" style={{ fontSize: '12px', width: '80px', color: '#e0e0e0' }}>⚡ Energy</span>
                <div className="breakdown-track" style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div className="breakdown-fill" style={{
                    height: '100%',
                    width: fillBars ? `${(breakdown.energy / totalKgCO2e * 100)}%` : '0%',
                    background: 'linear-gradient(90deg, #f57f17, #ffee58)',
                    transition: 'width 1s ease 0.7s',
                    borderRadius: '999px'
                  }} />
                </div>
                <span className="breakdown-value" style={{ fontSize: '12px', color: 'var(--text-secondary)', width: '45px', textAlign: 'right' }}>
                  {breakdown.energy.toFixed(2)} kg
                </span>
              </div>
            </div>
          )}

          {showXP && (
            <div className="xp-float">
              +{xpEarned} XP
            </div>
          )}

          {totalKgCO2e > 0 && <ImpactTranslator totalKgCO2e={totalKgCO2e} />}
        </div>
      </div>

      {totalKgCO2e > 0 && (
        <PersonalizedInsightCard highestCategory={dominantCategory} highestKey={dominantKey} />
      )}
    </aside>
  );
};
