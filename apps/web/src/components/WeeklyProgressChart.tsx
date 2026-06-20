import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

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
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: log.date,
      kg: log.totalKgCO2e,
      xp: log.xpEarned
    };
  });

  return (
    <div className="app-card" style={{ height: '100%', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📈</span> Weekly Trend
        </h2>
      </div>

      {data.length < 2 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{
              width: 64, height: 64, margin: '0 auto 16px',
              background: 'rgba(0,230,118,0.08)',
              border: '1px solid rgba(0,230,118,0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28
            }}>📊</div>
            <p style={{ fontSize: 14, color: '#ffffff', fontWeight: 600, marginBottom: 4 }}>
              Your trend starts here
            </p>
            <p style={{ fontSize: 12, color: '#616161', margin: 0 }}>
              Log 2+ days to see your weekly CO₂e trend
            </p>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, width: '100%', minHeight: 250 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#616161', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#616161', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine
                y={12}
                stroke="rgba(239, 83, 80, 0.5)"
                strokeDasharray="4 4"
                label={{ value: 'Global Avg', position: 'right', fill: '#616161', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#9e9e9e' }}
                formatter={(value: any) => [`${Number(value).toFixed(2)} kg CO₂e`, 'Footprint']}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar
                dataKey="kg"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
                fill="#00e676"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.kg > 12 ? '#ef5350' : entry.kg > 8 ? '#ffd600' : '#00e676'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
