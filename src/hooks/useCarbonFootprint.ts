import { useState, useEffect, useCallback } from 'react';
import { CarbonEngine } from '../core/CarbonEngine';
import type { DailyLogInputs } from '../core/CarbonEngine';
import { constants } from '../core/constants';
import { storageController } from '../core/storageController';

const engine = new CarbonEngine(
  constants.baseline_emission_factors_kg_co2e,
  constants.behavioral_nudges,
  constants.relatable_equivalents_per_1_kg_co2e
);

export function useCarbonFootprint() {
  const [state, setState] = useState<any>(storageController.get());

  const updateInputs = useCallback((newInputs: DailyLogInputs) => {
    const { totalKgCO2e, dominantCategory, dominantKey, breakdown } = engine.calculateDailyFootprint(newInputs);
    const insight = engine.getPersonalizedInsight(newInputs);
    const equivalents = engine.getRelatableEquivalent(totalKgCO2e);

    const newState = {
      lastUpdated: new Date().toISOString(),
      inputs: newInputs,
      results: {
        totalKgCO2e,
        equivalents,
        insight,
        dominantCategory,
        dominantKey,
        breakdown
      }
    };

    setState(newState);
    storageController.save(newState as any);
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
