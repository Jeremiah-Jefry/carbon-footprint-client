import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { getXPToNextLevel, getLevelFromXP } from '../data/levels';

import { LEVELS } from '../data/levels';

export const GamificationHeader: React.FC = () => {
  const { state } = useContext(GameContext);
  const currentLevel = getLevelFromXP(state.totalXP);
  const { progress, nextLevelTitle } = getXPToNextLevel(state.totalXP);

  const nextLevel = LEVELS.find(l => l.minXP > state.totalXP);
  const nextLevelXP = nextLevel ? nextLevel.minXP : 'Max';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 32px',
      background: 'rgba(255,255,255,0.03)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      marginBottom: '32px',
      gap: '24px',
      flexWrap: 'wrap',
      borderRadius: 'var(--radius-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{
          padding: '8px 16px',
          borderRadius: 'var(--radius-pill)',
          background: `linear-gradient(135deg, var(--accent-green-dim), var(--accent-green))`,
          color: '#000',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-display)'
        }}>
          <span style={{ fontSize: '1.2rem' }}>{currentLevel.icon}</span>
          <span>Lvl {currentLevel.level}: {currentLevel.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%`, transitionDelay: '500ms' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {state.totalXP} / {nextLevelXP} XP {nextLevelTitle ? `to ${nextLevelTitle}` : ''}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(255, 140, 0, 0.12)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(255, 140, 0, 0.25)'
      }}>
        <span style={{ fontSize: '18px' }}>🔥</span>
        <span style={{ fontWeight: 700, color: 'white', fontSize: '28px', lineHeight: 1 }}>{state.currentStreak}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>day streak</span>
      </div>
    </div>
  );
};
