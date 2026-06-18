/**
 * app.js
 *
 * Main entry point for the Carbon Footprint Tracker.
 * Wires up the UI inputs to the CarbonEngine computation layer
 * and manages persistence via storageController.
 */

import { constants } from './constants.js';
import CarbonEngine from './CarbonEngine.js';
import { storageController } from './storageController.js';

// 1. Initialize the computation engine with the empirical data
const engine = new CarbonEngine(
  constants.baseline_emission_factors_kg_co2e,
  constants.behavioral_nudges,
  constants.relatable_equivalents_per_1_kg_co2e
);

// 2. DOM Elements Selection
const form = document.getElementById('footprint-form');
const totalFootprintEl = document.getElementById('totalFootprint');
const equivalentsEl = document.getElementById('equivalents');
const insightEl = document.getElementById('dailyInsight');

/**
 * Updates the dashboard UI with calculated metrics.
 * @param {number} totalFootprint - The calculated kg CO2e
 * @param {Object} equivalents - Relatable equivalent metrics
 * @param {string} insight - Personalized behavioral nudge
 */
function updateDashboard(totalFootprint, equivalents, insight) {
  // Format footprint to 2 decimal places
  totalFootprintEl.textContent = Number(totalFootprint).toFixed(2);

  // Inject real relatable equivalents mapping from CarbonEngine
  equivalentsEl.innerHTML = `
    <p>📱 ≈ ${equivalents.smartphoneCharges} smartphone charges</p>
    <p>🚗 ≈ ${equivalents.milesDrivenGasCar} miles driven in a gas car</p>
    <p>🌳 ≈ ${equivalents.daysTreeAbsorption} days of tree absorption</p>
  `;

  // Update insight card
  insightEl.textContent = insight;
}

/**
 * Loads and renders the last saved state from LocalStorage on page load.
 */
function loadSavedState() {
  const state = storageController.get();
  if (!state?.results) return;

  // Restore form inputs from saved state
  if (state.inputs) {
    if (state.inputs.transportation) {
      document.getElementById('gas_car').value = state.inputs.transportation.gas_car || 0;
      document.getElementById('ev').value = state.inputs.transportation.ev || 0;
      document.getElementById('bus').value = state.inputs.transportation.bus || 0;
      document.getElementById('train').value = state.inputs.transportation.train || 0;
      document.getElementById('walking').value = state.inputs.transportation.walking || 0;
      document.getElementById('cycling').value = state.inputs.transportation.cycling || 0;
    }
    if (state.inputs.diet) {
      document.getElementById('beef').value = state.inputs.diet.beef || 0;
      document.getElementById('chicken').value = state.inputs.diet.chicken || 0;
      document.getElementById('fish').value = state.inputs.diet.fish || 0;
      document.getElementById('vegetarian').value = state.inputs.diet.vegetarian || 0;
      document.getElementById('vegan').value = state.inputs.diet.vegan || 0;
    }
    if (state.inputs.energy) {
      document.getElementById('streaming_video').value = state.inputs.energy.streaming_video || 0;
      document.getElementById('laundry_hot_wash_dry').value = state.inputs.energy.laundry_hot_wash_dry || 0;
      document.getElementById('laundry_cold_wash_air_dry').value = state.inputs.energy.laundry_cold_wash_air_dry || 0;
      document.getElementById('room_light_led').value = state.inputs.energy.room_light_led || 0;
      document.getElementById('room_light_incandescent').value = state.inputs.energy.room_light_incandescent || 0;
    }
  }

  updateDashboard(
    state.results.totalKgCO2e || 0,
    state.results.equivalents || { smartphoneCharges: 0, milesDrivenGasCar: 0, daysTreeAbsorption: 0 },
    state.results.insight || "Log an activity to get a personalized insight."
  );
}

// 3. Form Submission Handling
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Read current values directly from matching DOM IDs
  const dailyLog = {
    transportation: {
      gas_car: Number(document.getElementById('gas_car').value),
      ev: Number(document.getElementById('ev').value),
      bus: Number(document.getElementById('bus').value),
      train: Number(document.getElementById('train').value),
      walking: Number(document.getElementById('walking').value),
      cycling: Number(document.getElementById('cycling').value)
    },
    diet: {
      beef: Number(document.getElementById('beef').value),
      chicken: Number(document.getElementById('chicken').value),
      fish: Number(document.getElementById('fish').value),
      vegetarian: Number(document.getElementById('vegetarian').value),
      vegan: Number(document.getElementById('vegan').value)
    },
    energy: {
      streaming_video: Number(document.getElementById('streaming_video').value),
      laundry_hot_wash_dry: Number(document.getElementById('laundry_hot_wash_dry').value),
      laundry_cold_wash_air_dry: Number(document.getElementById('laundry_cold_wash_air_dry').value),
      room_light_led: Number(document.getElementById('room_light_led').value),
      room_light_incandescent: Number(document.getElementById('room_light_incandescent').value)
    }
  };

  // Run pure computation via CarbonEngine
  const { totalKgCO2e } = engine.calculateDailyFootprint(dailyLog);
  const insight = engine.getPersonalizedInsight(dailyLog);
  const equivalents = engine.getRelatableEquivalent(totalKgCO2e);

  // Build application state object
  const state = {
    lastUpdated: new Date().toISOString(),
    inputs: dailyLog,
    results: {
      totalKgCO2e,
      equivalents,
      insight
    }
  };

  // Save state and update UI
  storageController.save(state);
  updateDashboard(totalKgCO2e, equivalents, insight);
});

// Initialize the app on load
loadSavedState();
