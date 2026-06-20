import type { DailyLogInputs, CalculationResult } from '@carbon/emissions-engine';

export interface StorageLog {
  date: string;
  inputs: DailyLogInputs;
  results: CalculationResult;
}
