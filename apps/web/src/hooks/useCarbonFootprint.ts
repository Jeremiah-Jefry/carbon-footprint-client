import { useState, useCallback } from 'react';
import type { DailyLogInputs, CalculationResult } from '@carbon/emissions-engine';
import { CarbonEngine, constants } from '@carbon/emissions-engine';

interface CarbonState {
  inputs: DailyLogInputs;
  results: CalculationResult;
}

const defaultInputs: DailyLogInputs = {
  transportation: { walking: 0, cycling: 0, gas_car: 0, ev: 0, bus: 0, train: 0 },
  diet: { beef: 0, chicken: 0, fish: 0, vegetarian: 0, vegan: 0 },
  energy: { streaming_video: 0, laundry_hot_wash_dry: 0, laundry_cold_wash_air_dry: 0, room_light_led: 0, room_light_incandescent: 0 },
};

const defaultResults: CalculationResult = {
  totalKgCO2e: 0,
  breakdown: { transportation: 0, diet: 0, energy: 0 },
  dominantCategory: null,
  dominantKey: null,
};

// Even though we send to the backend, we still want instantaneous UI updates.
// We use the shared engine to calculate locally for instant feedback, then API persists it.
const engine = new CarbonEngine(
  constants.baseline_emission_factors_kg_co2e,
  constants.behavioral_nudges,
  constants.relatable_equivalents_per_1_kg_co2e
);

export function useCarbonFootprint() {
  const [state, setState] = useState<CarbonState>({
    inputs: defaultInputs,
    results: defaultResults,
  });

  const updateInputs = useCallback((newInputs: DailyLogInputs) => {
    // Local calculation for instant UI update
    const newResults = engine.calculateDailyFootprint(newInputs);
    setState({
      inputs: newInputs,
      results: newResults,
    });
  }, []);

  return { state, updateInputs, engine };
}
