/**
 * Core constants for the Carbon Footprint Tracker.
 * Contains empirical baseline emission factors, behavioral nudges, and equivalents.
 * Sourced from UK DEFRA (2023) and US EPA (2023) to provide real, cited figures.
 */

export interface EmissionFactorWithSource {
  value: number;
  source: string;
  year: number;
  unit: string;
}

export interface EmissionFactors {
  transportation_per_km: {
    walking: EmissionFactorWithSource;
    cycling: EmissionFactorWithSource;
    gas_car: EmissionFactorWithSource;
    ev: EmissionFactorWithSource;
    bus: EmissionFactorWithSource;
    train: EmissionFactorWithSource;
  };
  diet_per_serving: {
    beef: EmissionFactorWithSource;
    chicken: EmissionFactorWithSource;
    fish: EmissionFactorWithSource;
    vegetarian: EmissionFactorWithSource;
    vegan: EmissionFactorWithSource;
  };
  energy_and_tech_per_hour: {
    streaming_video: EmissionFactorWithSource;
    laundry_hot_wash_dry: EmissionFactorWithSource;
    laundry_cold_wash_air_dry: EmissionFactorWithSource;
    room_light_led: EmissionFactorWithSource;
    room_light_incandescent: EmissionFactorWithSource;
  };
}

export interface BehavioralNudge {
  action: string;
  personalized_insight: string;
}

export interface RelatableEquivalents {
  smartphone_charges: number;
  miles_driven_gas_car: number;
  days_tree_absorption: number;
}

export const constants = {
  baseline_emission_factors_kg_co2e: {
    transportation_per_km: {
      walking: { value: 0.0, source: "DEFRA", year: 2023, unit: "kgCO2e/km" },
      cycling: { value: 0.0, source: "DEFRA", year: 2023, unit: "kgCO2e/km" },
      gas_car: { value: 0.17, source: "DEFRA", year: 2023, unit: "kgCO2e/km" }, // Average petrol car
      ev: { value: 0.047, source: "DEFRA", year: 2023, unit: "kgCO2e/km" }, // Battery EV
      bus: { value: 0.096, source: "DEFRA", year: 2023, unit: "kgCO2e/km" }, // Local bus outside London
      train: { value: 0.035, source: "DEFRA", year: 2023, unit: "kgCO2e/km" } // National rail
    },
    diet_per_serving: {
      // Approximations per 100g or typical serving based on Our World in Data / Poore & Nemecek (2018)
      beef: { value: 6.0, source: "Poore & Nemecek (2018)", year: 2018, unit: "kgCO2e/serving" },
      chicken: { value: 0.69, source: "Poore & Nemecek (2018)", year: 2018, unit: "kgCO2e/serving" },
      fish: { value: 0.61, source: "Poore & Nemecek (2018)", year: 2018, unit: "kgCO2e/serving" }, // Farmed fish average
      vegetarian: { value: 0.81, source: "Scarborough et al.", year: 2014, unit: "kgCO2e/serving" }, // Average vegetarian meal
      vegan: { value: 0.46, source: "Scarborough et al.", year: 2014, unit: "kgCO2e/serving" } // Average vegan meal
    },
    energy_and_tech_per_hour: {
      streaming_video: { value: 0.036, source: "IEA", year: 2020, unit: "kgCO2e/hour" },
      laundry_hot_wash_dry: { value: 3.3, source: "Energy Saving Trust", year: 2022, unit: "kgCO2e/load" },
      laundry_cold_wash_air_dry: { value: 0.6, source: "Energy Saving Trust", year: 2022, unit: "kgCO2e/load" },
      room_light_led: { value: 0.0046, source: "EPA", year: 2023, unit: "kgCO2e/hour" },
      room_light_incandescent: { value: 0.027, source: "EPA", year: 2023, unit: "kgCO2e/hour" }
    }
  } as EmissionFactors,
  behavioral_nudges: [
    {
      action: "Meatless Substitution",
      personalized_insight: "Swapping just one beef meal for a plant-based alternative saves up to 5.5 kg of CO2e, instantly slashing your daily food footprint."
    },
    {
      action: "Cold Wash & Line Dry",
      personalized_insight: "Dropping your wash temperature to cold and air drying your clothes avoids around 2.7 kg of CO2e per load while making your fabrics last longer."
    },
    {
      action: "Active Transportation",
      personalized_insight: "Replacing short car trips with walking or cycling removes direct exhaust emissions, saving ~0.17 kg of CO2e for every single kilometer you travel."
    },
    {
      action: "Digital Efficiency",
      personalized_insight: "Lowering your streaming resolution or watching on a tablet drastically reduces energy use, providing a seamless viewing experience with a fraction of the emissions."
    },
    {
      action: "Eliminate Phantom Loads",
      personalized_insight: "Killing phantom power loads from unused electronics eliminates wasted baseline energy, cutting hidden household carbon emissions while you sleep."
    },
    {
      action: "Public Transit Shift",
      personalized_insight: "Trading a solo drive for a bus or train ride utilizes shared efficiency, dropping your commute's carbon footprint by more than half."
    },
    {
      action: "LED Optimization",
      personalized_insight: "Turning off unnecessary lights and relying on LEDs slashes your lighting footprint by over 80% compared to traditional bulbs, instantly lowering grid demand."
    }
  ] as BehavioralNudge[],
  relatable_equivalents_per_1_kg_co2e: {
    smartphone_charges: 121.65, // EPA 2023
    miles_driven_gas_car: 2.48, // EPA 2023
    days_tree_absorption: 16.6 // EPA 2023 (approximation)
  } as RelatableEquivalents
};
