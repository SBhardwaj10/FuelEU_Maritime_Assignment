import { RouteRecord, CBRecord } from "../domain/types";
declare const TARGET = 89.3368;
export declare function computeCBForRoute(route: RouteRecord): CBRecord;
export declare function computeCB(target: number, actual: number, fuelT: number): number;
export { TARGET };
