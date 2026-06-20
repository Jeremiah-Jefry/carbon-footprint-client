import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/achievements';

const BADGE_GRADIENTS: Record<string, string> = {
  first_log:       'linear-gradient(135deg, #1a3a1a, #2d5a2d)',
  streak_3:        'linear-gradient(135deg, #3a1a00, #7a3800)',
  streak_7:        'linear-gradient(135deg, #3a1a00, #8b4500)',
  streak_30:       'linear-gradient(135deg, #1a1a3a, #2d2d7a)',
  meatless_day:    'linear-gradient(135deg, #0d3320, #1a6640)',
  meatless_5:      'linear-gradient(135deg, #0d2a10, #1a5220)',
  green_commuter:  'linear-gradient(135deg, #002a1a, #005535)',
  carbon_neutral:  'linear-gradient(135deg, #001a2a, #003d5c)',
  below_average:   'linear-gradient(135deg, #1a2a00, #3d5c00)',
  led_only:        'linear-gradient(135deg, #2a1a00, #5c3d00)',
  cold_wash:       'linear-gradient(135deg, #00152a, #002f5c)',
  level_champion:  'linear-gradient(135deg, #2a2000, #5c4800)',
};

const BADGE_BORDER_COLORS: Record<string, string> = {
  first_log: '#4caf50', streak_3: '#ff8c00', streak_7: '#ff6600',
  streak_30: '#7c4dff', meatless_day: '#00c853', meatless_5: '#00b341',
  green_commuter: '#00e676', carbon_neutral: '#00b0ff', below_average: '#76ff03',
  led_only: '#ffd600', cold_wash: '#40c4ff', level_champion: '#ffc400',
};

export const AchievementsPanel: React.FC = () => {
  const { state } = useContext(GameContext);
  const [flash, setFlash] = useState(false);
  const [prevCount, setPrevCount] = useState(state.unlockedAchievements.length);

  useEffect(() => {
    if (state.unlockedAchievements.length > prevCount) {
      setFlash(true);
      setTimeout(() => setFlash(false), 1000);
      setPrevCount(state.unlockedAchievements.length);
    }
  }, [state.unlockedAchievements.length, prevCount]);

  return (
    <div className="app-card" style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #1a1a1a' }}>
      <div className="card-header">
        <h2 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🏅</span> Badges & Achievements
          <span style={{
            fontSize: '12px',
            color: flash ? '#00e676' : 'var(--text-secondary)',
            fontWeight: 500,
            marginLeft: 'auto',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '999px',
            padding: '4px 12px',
            transition: 'color 0.3s ease',
            textShadow: flash ? '0 0 8px rgba(0,230,118,0.5)' : 'none'
          }}>
            {state.unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
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
          const gradient = BADGE_GRADIENTS[achievement.id] || 'linear-gradient(135deg, #1a1a1a, #2a2a2a)';
          const borderColor = BADGE_BORDER_COLORS[achievement.id] || '#4caf50';

          return (
            <div
              key={achievement.id}
              className={isUnlocked ? "badge-card-unlocked" : "badge-card-locked"}
              style={isUnlocked ? {
                background: gradient,
                border: `1px solid ${borderColor}`,
                boxShadow: `0 0 20px ${borderColor}33`, // 33 is ~20% opacity hex
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              } : {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
              title={achievement.description} // CSS tooltip fallback
            >
              {!isUnlocked && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '1rem' }}>🔒</div>
              )}

              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: '64px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                lineHeight: 1
              }}>
                {achievement.icon}
              </div>

              <div style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>{achievement.title}</div>
              {isUnlocked && (
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.3 }}>{achievement.description}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
