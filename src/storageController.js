/**
 * storageController.js
 *
 * Thin wrapper to handle reading and writing to LocalStorage.
 * Keeps state persistent across sessions.
 */

const STORAGE_KEY = "cft_state";

const DEFAULT_STATE = {
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
    equivalents: {},
    insight: ""
  }
};

export const storageController = {
  /**
   * Retrieves the current state from LocalStorage,
   * or returns the DEFAULT_STATE if not found or on error.
   */
  get() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
        return DEFAULT_STATE;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Storage read error:", error);
      return DEFAULT_STATE;
    }
  },

  /**
   * Saves the provided data to LocalStorage.
   * @param {Object} data - The state to save.
   */
  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }
};
