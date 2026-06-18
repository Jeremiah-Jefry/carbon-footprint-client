import { useState, useEffect, useCallback } from 'react';
import { CarbonEngine } from '../core/CarbonEngine';
import type { DailyLogInputs } from '../core/CarbonEngine';
import { constants } from '../core/constants';
import { storageController } from '../core/storageController';
import type { AppState } from '../core/storageController';

const engine = new CarbonEngine(
  constants.baseline_emission_factors_kg_co2e,
  constants.behavioral_nudges,
  constants.relatable_equivalents_per_1_kg_co2e
);

export function useCarbonFootprint() {
  const [state, setState] = useState<AppState>(storageController.get());

  const updateInputs = useCallback((newInputs: DailyLogInputs) => {
    const { totalKgCO2e } = engine.calculateDailyFootprint(newInputs);
    const insight = engine.getPersonalizedInsight(newInputs);
    const equivalents = engine.getRelatableEquivalent(totalKgCO2e);

    const newState: AppState = {
      lastUpdated: new Date().toISOString(),
      inputs: newInputs,
      results: {
        totalKgCO2e,
        equivalents,
        insight
      }
    };

    setState(newState);
    storageController.save(newState);
  }, []);

  // Hydrate from localStorage on initial mount (client-side only to prevent hydration mismatch if SSR was added)
  useEffect(() => {
    setState(storageController.get());
  }, []);

  return {
    state,
    updateInputs
  };
}
