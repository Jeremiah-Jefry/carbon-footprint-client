/**
 * constants.js
 *
 * This file encapsulates the empirical baseline emission factors,
 * psychologically targeted behavioral nudges, and mathematically standardized
 * relatable equivalents for the Carbon Footprint Tracker.
 *
 * Data is extracted and formatted as a JavaScript object to be consumed
 * directly by the client-side application logic without requiring secondary
 * parsing or complex backend aggregations.
 */

export const constants = {
  baseline_emission_factors_kg_co2e: {
    transportation_per_km: {
      walking: 0.0,
      cycling: 0.0,
      gas_car: 0.25,
      ev: 0.053,
      bus: 0.105,
      train: 0.035
    },
    diet_per_serving: {
      beef: 6.0,
      chicken: 0.69,
      fish: 0.61,
      vegetarian: 0.81,
      vegan: 0.46
    },
    energy_and_tech_per_hour: {
      streaming_video: 0.036,
      laundry_hot_wash_dry: 3.3,
      laundry_cold_wash_air_dry: 0.6,
      room_light_led: 0.0046,
      room_light_incandescent: 0.027
    }
  },
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
      personalized_insight: "Replacing short car trips with walking or cycling removes direct exhaust emissions, saving 0.25 kg of CO2e for every single kilometer you travel."
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
  ],
  relatable_equivalents_per_1_kg_co2e: {
    smartphone_charges: 121.65,
    miles_driven_gas_car: 2.48,
    days_tree_absorption: 16.6
  }
};
