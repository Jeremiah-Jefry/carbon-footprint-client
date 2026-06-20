import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { getXPToNextLevel, getLevelFromXP } from '../data/levels';

export const GamificationHeader: React.FC = () => {
  const { state } = useContext(GameContext);
  const currentLevel = getLevelFromXP(state.totalXP);
  const { progress, nextLevelTitle } = getXPToNextLevel(state.totalXP);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderLeft: '4px solid var(--accent-green)',
      borderRadius: 'var(--radius-card)',
      marginBottom: '32px',
      gap: '24px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            <span>{state.totalXP} XP</span>
            <span>Next: {nextLevelTitle}</span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: '100%',
              backgroundColor: 'var(--accent-green)',
              borderRadius: '999px',
              transition: 'width 0.8s ease-in-out',
              animation: 'pulse-glow 2s infinite'
            }} />
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border-subtle)'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🔥</span>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{state.currentStreak}</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>day streak</span>
      </div>
    </div>
  );
};
