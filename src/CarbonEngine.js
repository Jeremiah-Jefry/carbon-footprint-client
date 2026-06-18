/**
 * CarbonEngine
 * Pure computation layer — no DOM access, no storage access.
 * Takes data in, returns data out. Fully unit-testable in isolation.
 */
export default class CarbonEngine {
  /**
   * @param {Object} emissionFactors - baseline_emission_factors_kg_co2e object
   * @param {Array} nudges - behavioral_nudges array
   * @param {Object} equivalents - relatable_equivalents_per_1_kg_co2e object
   */
  constructor(emissionFactors, nudges, equivalents) {
    this.factors = emissionFactors;
    this.equivalents = equivalents;

    // Map nudges by category once at construction — O(1) lookup at runtime
    // instead of Array.find() scanning on every insight request.
    this.nudgeMap = this._buildNudgeMap(nudges);
  }

  /**
   * Maps each emission category to its most relevant nudge.
   * Explicit mapping (not string-matching) avoids fragile coupling
   * to nudge wording, which can change independently of category keys.
   */
  _buildNudgeMap(nudges) {
    const findNudge = (action) => {
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
      // fallback for low-impact categories with no dedicated high-leverage nudge
      default: findNudge('Eliminate Phantom Loads'),
    };
  }

  /**
   * Calculates total daily footprint and per-category subtotals.
   * @param {Object} dailyLog - { transportation: {km...}, diet: {servings...}, energy: {hours...} }
   * @returns {{ totalKgCO2e: number, breakdown: Object, dominantCategory: string|null, dominantKey: string|null }}
   */
  calculateDailyFootprint(dailyLog) {
    const breakdown = { transportation: 0, diet: 0, energy: 0 };
    let dominantKey = null; // e.g. "transportation_gas_car" — most specific emitter
    let dominantValue = 0;

    const categoryFactorMap = {
      transportation: this.factors.transportation_per_km,
      diet: this.factors.diet_per_serving,
      energy: this.factors.energy_and_tech_per_hour,
    };

    for (const category of Object.keys(categoryFactorMap)) {
      const userEntries = dailyLog[category];
      const factorSet = categoryFactorMap[category];

      if (!userEntries) continue;

      for (const [activity, amount] of Object.entries(userEntries)) {
        const factor = factorSet[activity];

        // Guard against malformed input keys (typos, future schema drift)
        if (typeof factor !== 'number' || typeof amount !== 'number' || amount <= 0) {
          continue;
        }

        const emission = factor * amount;
        breakdown[category] += emission;

        // Track the single highest-emitting activity across ALL categories,
        // not just the highest category — this is what makes the nudge specific.
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
      dominantKey, // e.g. "transportation_gas_car"
      dominantCategory: dominantKey ? dominantKey.split('_')[0] : null,
    };
  }

  /**
   * Returns the single most relevant behavioral nudge for the day,
   * based on the highest-emitting specific activity (not just category).
   * @param {Object} dailyLog
   * @returns {string} personalized insight text
   */
  getPersonalizedInsight(dailyLog) {
    const { dominantKey } = this.calculateDailyFootprint(dailyLog);
    if (!dominantKey) {
      return this.nudgeMap.default || 'Log an activity to get a personalized insight.';
    }
    return this.nudgeMap[dominantKey] || this.nudgeMap.default;
  }

  /**
   * Converts a kg CO2e value (typically "saved") into relatable equivalents.
   * @param {number} totalKgSaved
   * @returns {{ smartphoneCharges: number, milesDrivenGasCar: number, daysTreeAbsorption: number }}
   */
  getRelatableEquivalent(totalKgSaved) {
    if (typeof totalKgSaved !== 'number' || totalKgSaved <= 0) {
      return { smartphoneCharges: 0, milesDrivenGasCar: 0, daysTreeAbsorption: 0 };
    }

    return {
      smartphoneCharges: this._round(totalKgSaved * this.equivalents.smartphone_charges),
      milesDrivenGasCar: this._round(totalKgSaved * this.equivalents.miles_driven_gas_car),
      daysTreeAbsorption: this._round(totalKgSaved * this.equivalents.days_tree_absorption),
    };
  }

  /** Rounds to 2 decimal places — avoids floating point noise (e.g. 5.840000000001) */
  _round(num) {
    return Math.round(num * 100) / 100;
  }
}
