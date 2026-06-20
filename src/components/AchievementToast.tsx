import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';
import { motion, AnimatePresence } from 'framer-motion';

export const AchievementToast: React.FC = () => {
  const { state, dispatch } = useContext(GameContext);
  const { newlyUnlockedAchievements } = state;
  const [currentToast, setCurrentToast] = useState<{id: string; title: string; description: string; icon: string;} | null>(null);

  useEffect(() => {
    if (newlyUnlockedAchievements.length > 0 && !currentToast) {
      const nextId = newlyUnlockedAchievements[0];
      const achievement = ACHIEVEMENTS.find(a => a.id === nextId);
      if (achievement) {
        setCurrentToast(achievement);
      } else {
        dispatch({ type: 'DISMISS_ACHIEVEMENT_TOAST' });
      }
    }
  }, [newlyUnlockedAchievements, currentToast, dispatch]);

  useEffect(() => {
    if (currentToast) {
      const timer = setTimeout(() => {
        setCurrentToast(null);
        dispatch({ type: 'DISMISS_ACHIEVEMENT_TOAST' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentToast, dispatch]);

  return (
    <AnimatePresence>
      {currentToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4, type: 'spring' }}
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--accent-green)',
            borderRadius: 'var(--radius-card)',
            padding: '16px 24px',
            boxShadow: 'var(--glow-green)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            minWidth: '300px'
          }}
        >
          <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{currentToast.icon}</div>
          <div>
            <div style={{ color: 'var(--accent-green)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
              Achievement Unlocked!
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
              {currentToast.title}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.3 }}>
              {currentToast.description}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
