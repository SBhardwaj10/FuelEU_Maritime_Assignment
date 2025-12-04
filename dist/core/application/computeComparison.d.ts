import { RouteRecord } from "../domain/types";
export type ComparisonRow = {
    routeId: string;
    baselineIntensity: number;
    comparisonIntensity: number;
    percentDiff: number;
    compliant: boolean;
};
export declare function compareWithBaseline(baseline: RouteRecord, comparison: RouteRecord): ComparisonRow;
