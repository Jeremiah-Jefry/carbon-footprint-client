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

    // 10 km gas_car (0.17) = 1.7
    // 1 beef (6.0) = 6.0
    // 2 hrs streaming (0.036) = 0.072 (rounds to 0.07)
    // Total: 7.77
    expect(result.totalKgCO2e).toBe(7.77);
    expect(result.breakdown.transportation).toBe(1.7);
    expect(result.breakdown.diet).toBe(6.0);
    expect(result.breakdown.energy).toBe(0.07);
    expect(result.dominantCategory).toBe('diet');
    expect(result.dominantKey).toBe('diet_beef');
  });

  it('should handle zero and negative inputs correctly', () => {
    const inputs: DailyLogInputs = {
      transportation: { gas_car: 0, ev: -5, bus: 0, train: 0, walking: 0, cycling: 0 },
      diet: { beef: -1, chicken: 0, fish: 0, vegetarian: 0, vegan: 0 },
      energy: { streaming_video: -10, laundry_hot_wash_dry: 0, laundry_cold_wash_air_dry: 0, room_light_led: 0, room_light_incandescent: 0 }
    };

    const result = engine.calculateDailyFootprint(inputs);
    expect(result.totalKgCO2e).toBe(0);
    expect(result.breakdown.transportation).toBe(0);
    expect(result.breakdown.diet).toBe(0);
    expect(result.breakdown.energy).toBe(0);
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

  it('should return default insight if no dominant factor', () => {
    const inputs: DailyLogInputs = {
      transportation: { gas_car: 0, ev: 0, bus: 0, train: 0, walking: 0, cycling: 0 },
      diet: { beef: 0, chicken: 0, fish: 0, vegetarian: 0, vegan: 0 },
      energy: { streaming_video: 0, laundry_hot_wash_dry: 0, laundry_cold_wash_air_dry: 0, room_light_led: 0, room_light_incandescent: 0 }
    };
    const insight = engine.getPersonalizedInsight(inputs);
    expect(insight).toContain('Killing phantom power loads');
  });

  it('should calculate relatable equivalents correctly', () => {
    const totalKg = 10;
    const equivalents = engine.getRelatableEquivalent(totalKg);

    expect(equivalents.smartphoneCharges).toBe(Math.round(10 * constants.relatable_equivalents_per_1_kg_co2e.smartphone_charges * 100) / 100);
    expect(equivalents.milesDrivenGasCar).toBe(Math.round(10 * constants.relatable_equivalents_per_1_kg_co2e.miles_driven_gas_car * 100) / 100);
    expect(equivalents.daysTreeAbsorption).toBe(Math.round(10 * constants.relatable_equivalents_per_1_kg_co2e.days_tree_absorption * 100) / 100);
  });

  it('should handle zero and negative inputs for relatable equivalents', () => {
     const equivalentsZero = engine.getRelatableEquivalent(0);
     expect(equivalentsZero.smartphoneCharges).toBe(0);

     const equivalentsNeg = engine.getRelatableEquivalent(-5);
     expect(equivalentsNeg.smartphoneCharges).toBe(0);
  });

  it('should aggregate multi-category totals accurately', () => {
     const inputs: DailyLogInputs = {
      transportation: { gas_car: 5, ev: 10, bus: 5, train: 2, walking: 2, cycling: 5 }, // 5*0.17 + 10*0.047 + 5*0.096 + 2*0.035 = 0.85 + 0.47 + 0.48 + 0.07 = 1.87
      diet: { beef: 0, chicken: 1, fish: 1, vegetarian: 1, vegan: 1 }, // 1*0.69 + 1*0.61 + 1*0.81 + 1*0.46 = 2.57
      energy: { streaming_video: 3, laundry_hot_wash_dry: 1, laundry_cold_wash_air_dry: 1, room_light_led: 5, room_light_incandescent: 1 } // 3*0.036 + 1*3.3 + 1*0.6 + 5*0.0046 + 1*0.027 = 0.108 + 3.3 + 0.6 + 0.023 + 0.027 = 4.058 -> 4.06
    };

    const result = engine.calculateDailyFootprint(inputs);

    expect(result.breakdown.transportation).toBe(1.87);
    expect(result.breakdown.diet).toBe(2.57);
    expect(result.breakdown.energy).toBe(4.06);
    expect(result.totalKgCO2e).toBe(8.50); // 1.87 + 2.57 + 4.06 = 8.5
  });
});
