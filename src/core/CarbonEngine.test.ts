import { describe, it, expect } from 'vitest';
import { CarbonEngine } from './CarbonEngine';
import type { DailyLogInputs } from './CarbonEngine';
import { constants } from './constants';

describe('CarbonEngine', () => {
  const engine = new CarbonEngine(
    constants.baseline_emission_factors_kg_co2e,
    constants.behavioral_nudges,
    constants.relatable_equivalents_per_1_kg_co2e
  );

  it('should calculate daily footprint correctly for valid inputs', () => {
    const inputs: DailyLogInputs = {
      transportation: {
        gas_car: 10,
        ev: 0,
        bus: 0,
        train: 0,
        walking: 0,
        cycling: 0
      },
      diet: {
        beef: 1,
        chicken: 0,
        fish: 0,
        vegetarian: 0,
        vegan: 0
      },
      energy: {
        streaming_video: 2,
        laundry_hot_wash_dry: 0,
        laundry_cold_wash_air_dry: 0,
        room_light_led: 0,
        room_light_incandescent: 0
      }
    };

    const result = engine.calculateDailyFootprint(inputs);

    // 10 km gas_car (0.25) = 2.5
    // 1 beef (6.0) = 6.0
    // 2 hrs streaming (0.036) = 0.072 (rounds to 0.07)
    // Total: 8.57
    expect(result.totalKgCO2e).toBe(8.57);
    expect(result.breakdown.transportation).toBe(2.5);
    expect(result.breakdown.diet).toBe(6.0);
    expect(result.breakdown.energy).toBe(0.07);
    expect(result.dominantCategory).toBe('diet');
    expect(result.dominantKey).toBe('diet_beef');
  });

  it('should handle zero inputs correctly', () => {
    const inputs: DailyLogInputs = {
      transportation: { gas_car: 0, ev: 0, bus: 0, train: 0, walking: 0, cycling: 0 },
      diet: { beef: 0, chicken: 0, fish: 0, vegetarian: 0, vegan: 0 },
      energy: { streaming_video: 0, laundry_hot_wash_dry: 0, laundry_cold_wash_air_dry: 0, room_light_led: 0, room_light_incandescent: 0 }
    };

    const result = engine.calculateDailyFootprint(inputs);
    expect(result.totalKgCO2e).toBe(0);
    expect(result.dominantCategory).toBeNull();
  });

  it('should generate personalized insight based on dominant factor', () => {
    const inputs: DailyLogInputs = {
      transportation: { gas_car: 100, ev: 0, bus: 0, train: 0, walking: 0, cycling: 0 },
      diet: { beef: 0, chicken: 0, fish: 0, vegetarian: 0, vegan: 0 },
      energy: { streaming_video: 0, laundry_hot_wash_dry: 0, laundry_cold_wash_air_dry: 0, room_light_led: 0, room_light_incandescent: 0 }
    };

    const insight = engine.getPersonalizedInsight(inputs);
    // Active Transportation nudge string check
    expect(insight).toContain('Replacing short car trips');
  });

  it('should calculate relatable equivalents correctly', () => {
    const totalKg = 10;
    const equivalents = engine.getRelatableEquivalent(totalKg);

    expect(equivalents.smartphoneCharges).toBe(Math.round(10 * constants.relatable_equivalents_per_1_kg_co2e.smartphone_charges * 100) / 100);
    expect(equivalents.milesDrivenGasCar).toBe(Math.round(10 * constants.relatable_equivalents_per_1_kg_co2e.miles_driven_gas_car * 100) / 100);
    expect(equivalents.daysTreeAbsorption).toBe(Math.round(10 * constants.relatable_equivalents_per_1_kg_co2e.days_tree_absorption * 100) / 100);
  });
});
