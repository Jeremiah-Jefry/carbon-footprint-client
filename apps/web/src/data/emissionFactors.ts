export const EMISSION_FACTORS = {
  transportation_per_km: {
    walking: 0.0,
    cycling: 0.0,
    gas_car: 0.25,
    ev: 0.053,
    bus: 0.105,
    train: 0.035,
  },
  diet_per_serving: {
    beef: 6.0,
    chicken: 0.69,
    fish: 0.61,
    vegetarian: 0.81,
    vegan: 0.46,
  },
  energy_per_hour_or_load: {
    streaming_video: 0.036,
    laundry_hot_wash_dry: 3.3,
    laundry_cold_wash_air_dry: 0.6,
    room_light_led: 0.0046,
    room_light_incandescent: 0.027,
  },
};

export const RELATABLE_EQUIVALENTS = {
  smartphone_charges_per_kg: 121.65,
  miles_driven_gas_per_kg: 2.48,
  days_tree_absorbs_per_kg: 16.6,
};

// Global average daily footprint for a developed-world individual: ~12 kg CO2e/day
export const GLOBAL_DAILY_AVERAGE_KG = 12.0;

export const BEHAVIORAL_NUDGES = [
  {
    action: "Meatless Substitution",
    insight: "Swapping just one beef meal for a plant-based alternative saves up to 5.5 kg of CO2e — instantly slashing your daily food footprint.",
    category: "diet",
    triggerIfHigh: "beef",
  },
  {
    action: "Cold Wash & Line Dry",
    insight: "Dropping your wash temperature to cold and air drying avoids around 2.7 kg of CO2e per load — and makes your fabrics last longer.",
    category: "energy",
    triggerIfHigh: "laundry_hot_wash_dry",
  },
  {
    action: "Active Transportation",
    insight: "Replacing short car trips with walking or cycling removes direct exhaust emissions — saving 0.25 kg of CO2e for every single kilometre.",
    category: "transport",
    triggerIfHigh: "gas_car",
  },
  {
    action: "Digital Efficiency",
    insight: "Lowering your streaming resolution or switching to a smaller screen drastically reduces energy use with zero drop in experience.",
    category: "energy",
    triggerIfHigh: "streaming_video",
  },
  {
    action: "Eliminate Phantom Loads",
    insight: "Unplugging unused electronics and chargers on standby cuts hidden household carbon emissions while you sleep.",
    category: "energy",
    triggerIfHigh: null,
  },
  {
    action: "Public Transit Shift",
    insight: "Trading a solo drive for a bus or train utilises shared efficiency — dropping your commute's footprint by more than half.",
    category: "transport",
    triggerIfHigh: "gas_car",
  },
  {
    action: "LED Optimization",
    insight: "Switching to LEDs and turning off unused lights slashes your lighting footprint by over 80% vs traditional bulbs.",
    category: "energy",
    triggerIfHigh: "room_light_incandescent",
  },
];
