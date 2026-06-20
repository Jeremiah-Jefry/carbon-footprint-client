export const CHALLENGE_POOL = [
  { id: "all_active_transport", text: "Walk or cycle all your transport today", reward: 25, condition: (log: any) => log.inputs.transportation.gas_car === 0 && log.inputs.transportation.bus === 0 && log.inputs.transportation.train === 0 && log.inputs.transportation.ev === 0 && (log.inputs.transportation.walking > 0 || log.inputs.transportation.cycling > 0) },
  { id: "no_beef", text: "Eat zero beef meals today", reward: 25, condition: (log: any) => log.inputs.diet.beef === 0 },
  { id: "cold_wash_only", text: "Use only cold wash if you do laundry", reward: 25, condition: (log: any) => log.inputs.energy.laundry_hot_wash_dry === 0 && log.inputs.energy.laundry_cold_wash_air_dry > 0 },
  { id: "less_video", text: "Watch less than 1 hour of video streaming", reward: 25, condition: (log: any) => log.inputs.energy.streaming_video < 1 },
  { id: "no_incandescent", text: "Use no incandescent lights today", reward: 25, condition: (log: any) => log.inputs.energy.room_light_incandescent === 0 },
  { id: "under_6kg", text: "Keep your total footprint under 6 kg CO2e", reward: 25, condition: (log: any) => log.totalKgCO2e < 6 },
  { id: "one_vegan", text: "Replace at least one meal with a vegan option", reward: 25, condition: (log: any) => log.inputs.diet.vegan >= 1 },
  { id: "use_transit", text: "Use public transit instead of a gas car", reward: 25, condition: (log: any) => log.inputs.transportation.gas_car === 0 && (log.inputs.transportation.bus > 0 || log.inputs.transportation.train > 0) },
  { id: "unplug_chargers", text: "Unplug all chargers on standby", reward: 25, condition: () => false, manual: true }, // manual trigger
  { id: "no_meat_at_all", text: "Eat zero meat (beef, chicken, fish)", reward: 30, condition: (log: any) => log.inputs.diet.beef === 0 && log.inputs.diet.chicken === 0 && log.inputs.diet.fish === 0 },
  { id: "no_car", text: "Don't use any car (gas or EV)", reward: 25, condition: (log: any) => log.inputs.transportation.gas_car === 0 && log.inputs.transportation.ev === 0 },
  { id: "all_led", text: "Use only LED lights", reward: 25, condition: (log: any) => log.inputs.energy.room_light_incandescent === 0 && log.inputs.energy.room_light_led > 0 },
  { id: "below_average_chal", text: "Keep footprint below global average (12kg)", reward: 15, condition: (log: any) => log.totalKgCO2e < 12 },
  { id: "ev_trip", text: "Use an EV instead of a gas car", reward: 25, condition: (log: any) => log.inputs.transportation.gas_car === 0 && log.inputs.transportation.ev > 0 },
  { id: "short_shower", text: "Take a shorter shower (under 5 mins)", reward: 25, condition: () => false, manual: true } // manual trigger
];

export function generateDailyChallenges(userHistoryStats: any = null) {
  // Try to generate a personalized challenge based on history if provided
  let pool = [...CHALLENGE_POOL];

  if (userHistoryStats) {
      // Very basic weighting: if they don't have meatless days, increase chance of diet challenge
      if (userHistoryStats.meatlessDays === 0) {
          pool.push(...CHALLENGE_POOL.filter(c => c.id === 'no_beef' || c.id === 'one_vegan' || c.id === 'no_meat_at_all'));
          pool.push(...CHALLENGE_POOL.filter(c => c.id === 'no_beef' || c.id === 'one_vegan' || c.id === 'no_meat_at_all'));
      }

      // If they haven't had a carbon-free transport day, weight transit heavily
      if (userHistoryStats.noCarbonTransportDays === 0) {
          pool.push(...CHALLENGE_POOL.filter(c => c.id === 'all_active_transport' || c.id === 'use_transit' || c.id === 'no_car'));
          pool.push(...CHALLENGE_POOL.filter(c => c.id === 'all_active_transport' || c.id === 'use_transit' || c.id === 'no_car'));
      }

      // If no cold wash days
      if (userHistoryStats.coldWashDays === 0) {
         pool.push(...CHALLENGE_POOL.filter(c => c.id === 'cold_wash_only'));
         pool.push(...CHALLENGE_POOL.filter(c => c.id === 'cold_wash_only'));
      }
  }

  const shuffled = pool.sort(() => 0.5 - Math.random());

  // Pick 3 unique challenges
  const selected: any[] = [];
  for (const challenge of shuffled) {
     if (!selected.find(c => c.id === challenge.id)) {
        selected.push(challenge);
     }
     if (selected.length === 3) break;
  }

  return selected.map(c => ({ id: c.id, text: c.text, completed: false, manual: !!c.manual, reward: c.reward }));
}
