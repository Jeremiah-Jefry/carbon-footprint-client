import type { EmissionFactors, BehavioralNudge, RelatableEquivalents } from './constants';

export interface DailyLogInputs {
  transportation: Record<keyof EmissionFactors['transportation_per_km'], number>;
  diet: Record<keyof EmissionFactors['diet_per_serving'], number>;
  energy: Record<keyof EmissionFactors['energy_and_tech_per_hour'], number>;
}

export interface Breakdown {
  transportation: number;
  diet: number;
  energy: number;
}

export interface CalculationResult {
  totalKgCO2e: number;
  breakdown: Breakdown;
  dominantCategory: string | null;
  dominantKey: string | null;
}

export interface EquivalentResult {
  smartphoneCharges: number;
  milesDrivenGasCar: number;
  daysTreeAbsorption: number;
}

/**
 * CarbonEngine
 * Pure computation layer — no DOM access, no storage access.
 * Fully unit-testable in isolation.
 */
export class CarbonEngine {
  private factors: EmissionFactors;
  private equivalents: RelatableEquivalents;
  private nudgeMap: Record<string, string | null>;

  constructor(
    emissionFactors: EmissionFactors,
    nudges: BehavioralNudge[],
    equivalents: RelatableEquivalents
  ) {
    this.factors = emissionFactors;
    this.equivalents = equivalents;
    this.nudgeMap = this._buildNudgeMap(nudges);
  }

  private _buildNudgeMap(nudges: BehavioralNudge[]): Record<string, string | null> {
    const findNudge = (action: string) => {
      const match = nudges.find((n) => n.action === action);
      return match ? match.personalized_insight : null;
    };

    return {
      transportation_gas_car: findNudge('Active Transportation'),
      transportation_bus: findNudge('Public Transit Shift'),
      transportation_train: findNudge('Public Transit Shift'),
      diet_beef: findNudge('Meatless Substitution'),
      diet_chicken: findNudge('Meatless Substitution'),
      diet_fish: findNudge('Meatless Substitution'),
      energy_laundry_hot_wash_dry: findNudge('Cold Wash & Line Dry'),
      energy_streaming_video: findNudge('Digital Efficiency'),
      energy_room_light_incandescent: findNudge('LED Optimization'),
      default: findNudge('Eliminate Phantom Loads'),
    };
  }

  public calculateDailyFootprint(dailyLog: DailyLogInputs): CalculationResult {
    const breakdown: Breakdown = { transportation: 0, diet: 0, energy: 0 };
    let dominantKey: string | null = null;
    let dominantValue = 0;

    const categoryFactorMap: Record<keyof DailyLogInputs, Record<string, number>> = {
      transportation: this.factors.transportation_per_km,
      diet: this.factors.diet_per_serving,
      energy: this.factors.energy_and_tech_per_hour,
    };

    for (const category of Object.keys(categoryFactorMap) as Array<keyof DailyLogInputs>) {
      const userEntries = dailyLog[category];
      const factorSet = categoryFactorMap[category];

      if (!userEntries) continue;

      for (const [activity, amount] of Object.entries(userEntries)) {
        const factor = factorSet[activity];

        if (typeof factor !== 'number' || typeof amount !== 'number' || amount <= 0) {
          continue;
        }

        const emission = factor * amount;
        breakdown[category] += emission;

        if (emission > dominantValue) {
          dominantValue = emission;
          dominantKey = `${category}_${activity}`;
        }
      }
    }

    const totalKgCO2e = Object.values(breakdown).reduce((sum, v) => sum + v, 0);

    return {
      totalKgCO2e: this._round(totalKgCO2e),
      breakdown: {
        transportation: this._round(breakdown.transportation),
        diet: this._round(breakdown.diet),
        energy: this._round(breakdown.energy),
      },
      dominantKey,
      dominantCategory: dominantKey ? dominantKey.split('_')[0] : null,
    };
  }

  public getPersonalizedInsight(dailyLog: DailyLogInputs): string {
    const { dominantKey } = this.calculateDailyFootprint(dailyLog);
    if (!dominantKey) {
      return this.nudgeMap.default || 'Log an activity to get a personalized insight.';
    }
    return this.nudgeMap[dominantKey] || this.nudgeMap.default || 'Log an activity to get a personalized insight.';
  }

  public getRelatableEquivalent(totalKgSaved: number): EquivalentResult {
    if (typeof totalKgSaved !== 'number' || totalKgSaved <= 0) {
      return { smartphoneCharges: 0, milesDrivenGasCar: 0, daysTreeAbsorption: 0 };
    }

    return {
      smartphoneCharges: this._round(totalKgSaved * this.equivalents.smartphone_charges),
      milesDrivenGasCar: this._round(totalKgSaved * this.equivalents.miles_driven_gas_car),
      daysTreeAbsorption: this._round(totalKgSaved * this.equivalents.days_tree_absorption),
    };
  }

  private _round(num: number): number {
    return Math.round(num * 100) / 100;
  }
}
