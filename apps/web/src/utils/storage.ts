// For the sake of this prototype and testing locally, we point to the functions emulator
// or simply use a predefined mock token since Firebase Auth isn't fully integrated yet on the client side.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';
const AUTH_TOKEN = 'test-token'; // Hardcoded for this prototype step

export const STORAGE_KEYS = {
  CHALLENGES: "cf_challenges", // Keeping challenges locally for now per requirements scope
};

export async function saveLog(logData: any) {
  try {
    await fetch(`${API_URL}/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        date: logData.date,
        inputs: logData.inputs,
        xpEarned: logData.xpEarned
      })
    });
  } catch (error) {
    console.error('Failed to save log to API:', error);
  }
}

export async function getLogs() {
  try {
    const res = await fetch(`${API_URL}/footprint`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (error) {
    console.error('Failed to get logs from API:', error);
    return [];
  }
}

export async function getGamificationState() {
  try {
    const res = await fetch(`${API_URL}/gamification`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to get gamification state:', error);
    return null;
  }
}

export async function updateGamificationState(newState: any) {
  try {
    await fetch(`${API_URL}/gamification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(newState)
    });
  } catch (error) {
    console.error('Failed to update gamification state:', error);
  }
}

export async function getTodaysLog() {
  const today = new Date().toISOString().split('T')[0];
  const logs = await getLogs();
  return logs.find((log: any) => log.date === today) || null;
}

// Keeping this synchronous for immediate UI checks where we just check local storage if we logged today
// For real prod, this should rely on state or we ensure context loads first
export function hasTodayBeenLogged() {
  return localStorage.getItem('logged_today') === new Date().toISOString().split('T')[0];
}

export function setLoggedToday() {
  localStorage.setItem('logged_today', new Date().toISOString().split('T')[0]);
}

export function getChallengesState() {
  const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
  return data ? JSON.parse(data) : null;
}

export function saveChallengesState(state: any) {
  localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(state));
}
