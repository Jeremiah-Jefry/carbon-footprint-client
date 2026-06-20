import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';

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
    <>
      {currentToast && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #0a2e0a, #163d16)',
            border: '1px solid rgba(0,230,118,0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            minWidth: '280px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,230,118,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'toastIn 0.4s ease forwards'
          }}
        >
          <div style={{ fontSize: '32px', lineHeight: 1 }}>{currentToast.icon}</div>
          <div>
            <div style={{ color: '#00e676', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '4px' }}>
              Achievement Unlocked!
            </div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
              {currentToast.title}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
