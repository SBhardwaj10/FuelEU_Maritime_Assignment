import { RouteRecord } from "../domain/types";

export type ComparisonRow = {
  routeId: string;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
};

export function compareWithBaseline(baseline: RouteRecord, comparison: RouteRecord): ComparisonRow {
  const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
  const compliant = comparison.ghgIntensity <= baseline.ghgIntensity * 0.98 || comparison.ghgIntensity <= 89.3368;
  return {
    routeId: comparison.routeId,
    baselineIntensity: baseline.ghgIntensity,
    comparisonIntensity: comparison.ghgIntensity,
    percentDiff,
    compliant,
  };
}
