import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { motion } from 'framer-motion';

export const AchievementsPanel: React.FC = () => {
  const { state } = useContext(GameContext);

  return (
    <div className="card" style={{ marginTop: '32px' }}>
      <div className="card-header">
        <h2 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🏅</span> Badges & Achievements
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, marginLeft: 'auto' }}>
            {state.unlockedAchievements.length} / {ACHIEVEMENTS.length}
          </span>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '24px'
      }}>
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = state.unlockedAchievements.includes(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
              style={{
                backgroundColor: 'var(--bg-highlight)',
                borderRadius: '16px',
                padding: '24px 16px',
                textAlign: 'center',
                position: 'relative',
                border: isUnlocked ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
                boxShadow: isUnlocked ? 'var(--glow-green)' : 'none',
                opacity: isUnlocked ? 1 : 0.35,
                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {!isUnlocked && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '1rem' }}>🔒</div>
              )}
              <div style={{ fontSize: '3rem', lineHeight: 1 }}>{achievement.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{achievement.title}</div>
              {isUnlocked && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{achievement.description}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
