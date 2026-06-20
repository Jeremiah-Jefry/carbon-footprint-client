import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export const LeaderboardStub: React.FC = () => {
  const { state } = useContext(GameContext);

  function getLeaderboardDisplay(totalXP: number, currentStreak: number) {
    if (totalXP === 0) {
      return {
        headline: "Ready to climb the ranks?",
        subtext: "Log your first activity to get your eco-warrior rank.",
        showRank: false,
        percentile: 0
      };
    }
    // Rank calculation: simulate a bell curve of users
    // Most users are around 200-800 XP. Score above 1000 XP = top 15%
    const estimatedPercentile = Math.max(1, Math.min(95, Math.round(100 - (totalXP / 50))));
    return {
      headline: `You're in the top ${estimatedPercentile}%`,
      subtext: `${currentStreak} day streak. Keep logging to climb the global leaderboard.`,
      showRank: true,
      percentile: estimatedPercentile,
    };
  }

  const displayInfo = getLeaderboardDisplay(state.totalXP, state.currentStreak);

  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (100 - displayInfo.percentile) / 100;

  return (
    <div className="app-card" style={{ marginTop: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-amber)', marginBottom: '16px' }}>🏆 Weekly Leaderboard</h2>

        {displayInfo.showRank ? (
          <div style={{ position: 'relative', width: '70px', height: '70px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="70" height="70" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
              <circle cx="35" cy="35" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle cx="35" cy="35" r={radius} fill="none" stroke="#00e676" strokeWidth="5"
                strokeDasharray={`${circumference * progress} ${circumference}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {displayInfo.percentile}<span style={{ fontSize: '12px' }}>%</span>
            </div>
          </div>
        ) : (
           <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌱</div>
        )}

        <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>
          {displayInfo.headline}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '80%' }}>
          {displayInfo.subtext}
        </p>
      </div>
    </div>
  );
};
