export const STORAGE_KEYS = {
  LOGS: "cf_logs",
  GAMIFICATION: "cf_gamification",
  CHALLENGES: "cf_challenges",
};

export function saveLog(logData: any) {
  const logs = getLogs();
  logs.push(logData);
  // Keep only last 30 logs
  if (logs.length > 30) {
    logs.shift();
  }
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export function getLogs() {
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  return data ? JSON.parse(data) : [];
}

export function getGamificationState() {
  const data = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
  return data ? JSON.parse(data) : null;
}

export function updateGamificationState(newState: any) {
  localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(newState));
}

export function getTodaysLog() {
  const today = new Date().toISOString().split('T')[0];
  const logs = getLogs();
  return logs.find((log: any) => log.date === today) || null;
}

export function hasTodayBeenLogged() {
  return getTodaysLog() !== null;
}

export function getChallengesState() {
  const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
  return data ? JSON.parse(data) : null;
}

export function saveChallengesState(state: any) {
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(state));
}
