import type { DailyLogInputs, EquivalentResult } from './CarbonEngine';

const STORAGE_KEY = "cft_state";

export interface AppState {
  lastUpdated: string | null;
  inputs: DailyLogInputs;
  results: {
    totalKgCO2e: number;
    equivalents: EquivalentResult;
    insight: string;
  };
}

const DEFAULT_STATE: AppState = {
  lastUpdated: null,
  inputs: {
    transportation: {
      gas_car: 0,
      ev: 0,
      bus: 0,
      train: 0,
      walking: 0,
      cycling: 0
    },
    diet: {
      beef: 0,
      chicken: 0,
      fish: 0,
      vegetarian: 0,
      vegan: 0
    },
    energy: {
      streaming_video: 0,
      laundry_hot_wash_dry: 0,
      laundry_cold_wash_air_dry: 0,
      room_light_led: 0,
      room_light_incandescent: 0
    }
  },
  results: {
    totalKgCO2e: 0,
    equivalents: { smartphoneCharges: 0, milesDrivenGasCar: 0, daysTreeAbsorption: 0 },
    insight: "Log an activity to get a personalized insight."
  }
};

export const storageController = {
  get(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
        return DEFAULT_STATE;
      }
      return JSON.parse(stored) as AppState;
    } catch (error) {
      console.error("Storage read error:", error);
      return DEFAULT_STATE;
    }
  },

  save(data: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }
};
