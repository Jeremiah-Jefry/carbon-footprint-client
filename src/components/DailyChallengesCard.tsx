import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export const DailyChallengesCard: React.FC = () => {
  const { state, dispatch } = useContext(GameContext);

  const completedCount = state.todaysChallenges.filter(c => c.completed).length;
  const totalEarned = state.todaysChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🎯</span> Daily Challenges
        </h2>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {completedCount}/3 Complete — <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>+{totalEarned} XP</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {state.todaysChallenges.map(challenge => (
          <div
            key={challenge.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: challenge.completed ? 'var(--bg-primary)' : 'var(--bg-highlight)',
              border: challenge.completed ? '1px solid var(--accent-green)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              opacity: challenge.completed ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CHALLENGE', payload: challenge.id })}
                disabled={!challenge.manual && !challenge.completed}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: challenge.completed ? 'none' : '2px solid var(--border-subtle)',
                  backgroundColor: challenge.completed ? 'var(--accent-green)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: challenge.manual ? 'pointer' : 'default',
                  color: '#000',
                  flexShrink: 0
                }}
                title={!challenge.manual ? "Auto-completes when logging activity" : "Click to toggle"}
              >
                {challenge.completed && '✓'}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 500,
                  textDecoration: challenge.completed ? 'line-through' : 'none',
                  color: challenge.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                  wordBreak: 'break-word'
                }}>
                  {challenge.text}
                </div>
                {!challenge.manual && !challenge.completed && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Auto-completes upon logging</div>
                )}
              </div>
            </div>

            <div style={{
              backgroundColor: challenge.completed ? 'transparent' : 'rgba(0, 230, 118, 0.1)',
              color: 'var(--accent-green)',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              marginLeft: '12px'
            }}>
              +{challenge.reward} XP
            </div>
          </div>
        ))}
        {state.todaysChallenges.length === 0 && (
           <div style={{color: 'var(--text-muted)'}}>No challenges available for today.</div>
        )}
      </div>
    </div>
  );
};
