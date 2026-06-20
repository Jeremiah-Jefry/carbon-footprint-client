import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getLogs, getGamificationState, updateGamificationState, saveLog, getChallengesState, saveChallengesState } from '../utils/storage';
import { generateDailyChallenges, CHALLENGE_POOL } from '../data/challenges';
import { ACHIEVEMENTS } from '../data/achievements';

interface StatState {
  totalDaysLogged: number;
  meatlessDays: number;
  noCarbonTransportDays: number;
  subTwoKgDays: number;
  belowAverageDays: number;
  ledOnlyDays: number;
  coldWashDays: number;
  totalXP: number;
  currentStreak: number;
}

interface GamificationState {
  totalXP: number;
  currentStreak: number;
  lastLogDate: string | null;
  unlockedAchievements: string[];
  logs: any[];
  stats: StatState;
  todaysChallenges: any[];
  newlyUnlockedAchievements: string[];
}

const initialState: GamificationState = {
  totalXP: 0,
  currentStreak: 0,
  lastLogDate: null,
  unlockedAchievements: [],
  logs: [],
  stats: {
    totalDaysLogged: 0,
    meatlessDays: 0,
    noCarbonTransportDays: 0,
    subTwoKgDays: 0,
    belowAverageDays: 0,
    ledOnlyDays: 0,
    coldWashDays: 0,
    totalXP: 0,
    currentStreak: 0,
  },
  todaysChallenges: [],
  newlyUnlockedAchievements: [],
};

type Action =
  | { type: 'HYDRATE'; payload: any }
  | { type: 'LOG_ACTIVITY'; payload: any }
  | { type: 'TOGGLE_CHALLENGE'; payload: string }
  | { type: 'DISMISS_ACHIEVEMENT_TOAST' }
  | { type: 'CLEAR_NEWLY_UNLOCKED' };

function gameReducer(state: GamificationState, action: Action): GamificationState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload };

    case 'TOGGLE_CHALLENGE': {
      const challengeId = action.payload;
      const challengeIndex = state.todaysChallenges.findIndex((c: any) => c.id === challengeId);

      if (challengeIndex === -1) return state;

      const challenge = state.todaysChallenges[challengeIndex];
      const isCompleting = !challenge.completed;

      const newChallenges = [...state.todaysChallenges];
      newChallenges[challengeIndex] = { ...challenge, completed: isCompleting };

      const xpDelta = isCompleting ? challenge.reward : -challenge.reward;
      const newTotalXP = state.totalXP + xpDelta;

      const newState = {
        ...state,
        totalXP: newTotalXP,
        stats: { ...state.stats, totalXP: newTotalXP },
        todaysChallenges: newChallenges,
      };

      const today = new Date().toISOString().split('T')[0];
      saveChallengesState({ date: today, challenges: newChallenges });
      updateGamificationState({ ...newState, todaysChallenges: undefined, newlyUnlockedAchievements: undefined });

      return newState;
    }

    case 'LOG_ACTIVITY': {
      const logData = action.payload;
      const today = logData.date;

      let newStreak = state.currentStreak;
      if (state.lastLogDate !== today) {
        if (state.lastLogDate) {
          const lastDate = new Date(state.lastLogDate);
          const currentDate = new Date(today);
          const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak++;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
      }

      let challengeXP = 0;
      const newChallenges = [...state.todaysChallenges];

      state.todaysChallenges.forEach((challenge, index) => {
        if (!challenge.completed && !challenge.manual) {
           const poolChallenge = CHALLENGE_POOL.find(c => c.id === challenge.id);
           if (poolChallenge && poolChallenge.condition(logData)) {
              newChallenges[index] = { ...challenge, completed: true };
              challengeXP += challenge.reward;
              logData.challengesCompleted = logData.challengesCompleted || [];
              logData.challengesCompleted.push(challenge.id);
           }
        }
      });

      const totalNewXP = logData.xpEarned + challengeXP;
      const newTotalXP = state.totalXP + totalNewXP;

      const newStats = { ...state.stats };
      newStats.totalDaysLogged++;
      newStats.currentStreak = newStreak;
      newStats.totalXP = newTotalXP;
      if (logData.inputs.diet.beef === 0) newStats.meatlessDays++;

      const noCarbonTransport = (logData.inputs.transportation.gas_car || 0) === 0;
      if (noCarbonTransport) newStats.noCarbonTransportDays++;

      if (logData.totalKgCO2e < 2) newStats.subTwoKgDays++;
      if (logData.totalKgCO2e < 12.0) newStats.belowAverageDays++;

      if ((logData.inputs.energy.room_light_incandescent || 0) === 0) newStats.ledOnlyDays++;
      if ((logData.inputs.energy.laundry_hot_wash_dry || 0) === 0 && (logData.inputs.energy.laundry_cold_wash_air_dry || 0) > 0) newStats.coldWashDays++;

      const newlyUnlocked: string[] = [];
      const newUnlockedAchievements = [...state.unlockedAchievements];

      ACHIEVEMENTS.forEach(achievement => {
        if (!newUnlockedAchievements.includes(achievement.id) && achievement.condition(newStats)) {
          newUnlockedAchievements.push(achievement.id);
          newlyUnlocked.push(achievement.id);
        }
      });

      const newState = {
        ...state,
        totalXP: newTotalXP,
        currentStreak: newStreak,
        lastLogDate: today,
        stats: newStats,
        logs: [...state.logs, logData].slice(-30),
        unlockedAchievements: newUnlockedAchievements,
        newlyUnlockedAchievements: [...state.newlyUnlockedAchievements, ...newlyUnlocked],
        todaysChallenges: newChallenges,
      };

      saveLog(logData);
      saveChallengesState({ date: today, challenges: newChallenges });
      updateGamificationState({
         totalXP: newTotalXP,
         currentStreak: newStreak,
         lastLogDate: today,
         unlockedAchievements: newUnlockedAchievements,
         stats: newStats,
      });

      return newState;
    }

    case 'DISMISS_ACHIEVEMENT_TOAST': {
      const newQueue = [...state.newlyUnlockedAchievements];
      newQueue.shift();
      return { ...state, newlyUnlockedAchievements: newQueue };
    }
    case 'CLEAR_NEWLY_UNLOCKED':
      return { ...state, newlyUnlockedAchievements: [] };

    default:
      return state;
  }
}

export const GameContext = createContext<{
  state: GamificationState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const hydrate = async () => {
      const today = new Date().toISOString().split('T')[0];
      const gamificationState = await getGamificationState();
      const savedLogs = await getLogs();
      const challengeState = getChallengesState();

      let todaysChallenges = [];
      if (challengeState && challengeState.date === today) {
        todaysChallenges = challengeState.challenges;
      } else {
        todaysChallenges = generateDailyChallenges(gamificationState?.stats);
        saveChallengesState({ date: today, challenges: todaysChallenges });
      }

      dispatch({
        type: 'HYDRATE',
        payload: {
          ...(gamificationState || {}),
          logs: savedLogs,
          todaysChallenges,
        },
      });
    };
    hydrate();
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
