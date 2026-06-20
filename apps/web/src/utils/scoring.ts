import { GLOBAL_DAILY_AVERAGE_KG } from "../data/emissionFactors";

export function calculateDailyXP(totalKgCO2e: number, inputs: any) {
  const saved = Math.max(0, GLOBAL_DAILY_AVERAGE_KG - totalKgCO2e);
  const baseXP = Math.round(saved * 10);
  const loggingBonus = 5; // always get 5 XP for logging

  let bonusXP = 0;
  // Bonus XP for specific "green choices"
  // +20 XP if gas_car km = 0
  if (inputs.transportation?.gas_car === 0) bonusXP += 20;
  // +15 XP if beef servings = 0
  if (inputs.diet?.beef === 0) bonusXP += 15;
  // +10 XP if laundry_hot_wash_dry loads = 0
  if (inputs.energy?.laundry_hot_wash_dry === 0) bonusXP += 10;
  // +5 XP if room_light_incandescent hours = 0
  if (inputs.energy?.room_light_incandescent === 0) bonusXP += 5;

  // +10 XP for using only walking/cycling for transport
  const hasWalkingOrCycling = (inputs.transportation?.walking || 0) > 0 || (inputs.transportation?.cycling || 0) > 0;
  const noOtherTransport = (inputs.transportation?.gas_car || 0) === 0 &&
                           (inputs.transportation?.ev || 0) === 0 &&
                           (inputs.transportation?.bus || 0) === 0 &&
                           (inputs.transportation?.train || 0) === 0;

  if (hasWalkingOrCycling && noOtherTransport) {
    bonusXP += 10;
  }

  return baseXP + loggingBonus + bonusXP;
}
