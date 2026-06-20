import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { GLOBAL_DAILY_AVERAGE_KG } from '../data/emissionFactors';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const WeeklyProgressChart: React.FC = () => {
  const { state } = useContext(GameContext);

  // Get last 7 days of logs
  const recentLogs = [...state.logs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  // Fill in empty days if less than 7 logs exist
  const data = recentLogs.map(log => {
    const d = new Date(log.date);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: log.date,
      co2: log.totalKgCO2e,
      xp: log.xpEarned
    };
  });

  return (
    <div className="card" style={{ height: '100%', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📈</span> Weekly Trend
        </h2>
      </div>

      {data.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '16px', backgroundColor: 'var(--bg-highlight)', borderRadius: '12px', margin: '8px 0' }}>
          <div style={{ fontSize: '3rem', filter: 'grayscale(100%)', opacity: 0.5 }}>📊</div>
          <p style={{ margin: 0, fontWeight: 500, fontSize: '0.95rem' }}>Log your activities to see your trend here.</p>
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', minHeight: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      padding: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                      <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</p>
                      <p style={{ margin: '4px 0', color: 'var(--accent-green)' }}>
                        {payload[0].value} kg CO₂e
                      </p>
                      {payload[0].payload.xp && (
                         <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                           {payload[0].payload.xp} XP Earned
                         </p>
                      )}
                    </div>
                  );
                }
                return null;
              }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <ReferenceLine y={GLOBAL_DAILY_AVERAGE_KG} stroke="var(--accent-red)" strokeDasharray="3 3" label={{ position: 'top', value: 'Avg', fill: 'var(--accent-red)', fontSize: 10 }} />
              <Bar
                dataKey="co2"
                fill="var(--accent-green)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
