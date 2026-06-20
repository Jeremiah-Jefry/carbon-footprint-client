export const LEVELS = [
  { level: 1, title: "Carbon Seedling",   minXP: 0,     icon: "🌱", color: "#a5d6a7" },
  { level: 2, title: "Eco Sprout",        minXP: 150,   icon: "🌿", color: "#66bb6a" },
  { level: 3, title: "Green Guardian",    minXP: 500,   icon: "🌳", color: "#43a047" },
  { level: 4, title: "Climate Champion",  minXP: 1200,  icon: "⚡", color: "#00e676" },
  { level: 5, title: "Earth Defender",    minXP: 2500,  icon: "🌍", color: "#00bcd4" },
  { level: 6, title: "Eco Legend",        minXP: 5000,  icon: "🏆", color: "#ffd700" },
];

export function getLevelFromXP(totalXP: number) {
  return [...LEVELS].reverse().find(l => totalXP >= l.minXP) || LEVELS[0];
}

export function getXPToNextLevel(totalXP: number) {
  const currentLevel = getLevelFromXP(totalXP);
  const nextLevel = LEVELS.find(l => l.minXP > totalXP);
  if (!nextLevel) return { needed: 0, progress: 100 };
  const needed = nextLevel.minXP - totalXP;
  const progress = ((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100;
  return { needed, progress: Math.round(progress), nextLevelTitle: nextLevel.title };
}
