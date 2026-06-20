import React, { useContext, useState } from 'react';
import { useCarbonFootprint } from './hooks/useCarbonFootprint';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { GameContext } from './context/GameContext';
import { GamificationHeader } from './components/GamificationHeader';
import { AchievementToast } from './components/AchievementToast';
import { AchievementsPanel } from './components/AchievementsPanel';
import { DailyChallengesCard } from './components/DailyChallengesCard';
import { WeeklyProgressChart } from './components/WeeklyProgressChart';
import { LeaderboardStub } from './components/LeaderboardStub';
import { hasTodayBeenLogged } from './utils/storage';
import { calculateDailyXP } from './utils/scoring';

const App: React.FC = () => {
  const { state: carbonState, updateInputs } = useCarbonFootprint();
  const { dispatch } = useContext(GameContext);
  const [isLoggedToday, setIsLoggedToday] = useState(hasTodayBeenLogged());
  const [showEdit, setShowEdit] = useState(!isLoggedToday);
  const [xpEarnedJustNow, setXpEarnedJustNow] = useState(0);

  const handleCalculate = (inputs: any) => {
    updateInputs(inputs);

    // We need to calculate the carbon results immediately for the game log
    // We'll rely on the carbon hook for UI update but we calculate here for log
    // Actually, useCarbonFootprint is synchronous? updateInputs is.
    // However, it's safer to re-calc or just let useCarbonFootprint's useEffect update its state
    // But updateInputs is synchronous state set.

    // Quick workaround to get result synchronously:
    import('./core/constants').then(({ constants }) => {
      import('./core/CarbonEngine').then(({ CarbonEngine }) => {
        const engine = new CarbonEngine(
          constants.baseline_emission_factors_kg_co2e,
          constants.behavioral_nudges,
          constants.relatable_equivalents_per_1_kg_co2e
        );
        const result = engine.calculateDailyFootprint(inputs);
        const baseXP = calculateDailyXP(result.totalKgCO2e, inputs);

        setXpEarnedJustNow(baseXP); // base XP before challenges

        dispatch({
          type: 'LOG_ACTIVITY',
          payload: {
            date: new Date().toISOString().split('T')[0],
            inputs,
            totalKgCO2e: result.totalKgCO2e,
            breakdown: result.breakdown,
            xpEarned: baseXP
          }
        });

        setIsLoggedToday(true);
        setShowEdit(false);
      });
    });
  };

  return (
    <main className="container">
      <AchievementToast />

      <GamificationHeader />

      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,230,118,0.08)',
          border: '1px solid rgba(0,230,118,0.15)',
          borderRadius: 999, padding: '4px 14px',
          fontSize: 12, color: '#00e676', marginBottom: 12,
          letterSpacing: '1px',
          fontWeight: 600
        }}>
          🌍 CARBON FOOTPRINT TRACKER
        </div>
        <h1 style={{
          fontSize: 48, fontWeight: 800, letterSpacing: '-1px',
          background: 'linear-gradient(135deg, #ffffff 60%, #00e676)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.1, marginBottom: 8, fontFamily: 'var(--font-display)'
        }}>Track. Reduce. Win.</h1>
        <p style={{ fontSize: 16, color: '#9e9e9e', maxWidth: 480 }}>
          Every action you log earns XP, unlocks badges, and moves you closer to a zero-carbon lifestyle.
        </p>
      </div>

      <div className="layout-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {isLoggedToday && !showEdit ? (
            <div className="app-card" style={{ textAlign: 'center', borderColor: 'var(--accent-green)', boxShadow: 'var(--glow-green)' }}>
              <h2 style={{ color: 'var(--accent-green)', marginBottom: '8px' }}>✓ Today's Log is In!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Great job logging your daily footprint.</p>
              <button className="calculate-btn" style={{ width: 'auto', backgroundColor: 'var(--bg-highlight)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }} onClick={() => setShowEdit(true)}>
                Edit Today's Log
              </button>
            </div>
          ) : (
            <InputForm
              initialInputs={carbonState.inputs}
              onSubmit={handleCalculate}
            />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Dashboard
            totalKgCO2e={carbonState.results.totalKgCO2e}
            breakdown={carbonState.results.breakdown}
            dominantCategory={carbonState.results.dominantCategory}
            dominantKey={carbonState.results.dominantKey}
            xpEarned={xpEarnedJustNow}
          />
          <LeaderboardStub />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            <DailyChallengesCard />
            <WeeklyProgressChart />
          </div>
        </div>
      </div>

      <AchievementsPanel />
    </main>
  );
};

export default App;
