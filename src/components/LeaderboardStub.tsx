import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { GLOBAL_DAILY_AVERAGE_KG } from '../data/emissionFactors';

export const LeaderboardStub: React.FC = () => {
  const { state } = useContext(GameContext);

  // Hypothetical average for a week is 12kg/day * 7 * 10 XP base
  const weeklyAverageXP = GLOBAL_DAILY_AVERAGE_KG * 7 * 10;

  // Calculate a fake percentile based on their XP compared to weekly average.
  // Clamped between 1% and 99%
  let rankPercentile = Math.round((1 - (state.totalXP / weeklyAverageXP)) * 100);
  if (rankPercentile <= 0) rankPercentile = 1;
  if (rankPercentile > 99) rankPercentile = 99;

  if (state.totalXP === 0) {
      rankPercentile = 99; // just started
  }

  return (
    <div className="card" style={{ marginTop: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 60%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-amber)', marginBottom: '16px' }}>🏆 Weekly Leaderboard</h2>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          You're in the top <strong style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>{rankPercentile}%</strong> of eco-warriors this week!
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Keep logging activities and completing challenges to climb the ranks. Global leaderboards are coming soon!
        </p>
      </div>
    </div>
  );
};
