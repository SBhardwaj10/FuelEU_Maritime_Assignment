import { RouteRecord, CBRecord } from "../domain/types";

const TARGET = 89.3368; // gCO2e/MJ
const MJ_PER_TONNE = 41000; // MJ/t

export function computeCBForRoute(route: RouteRecord): CBRecord {
  const energy = route.fuelConsumptionT * MJ_PER_TONNE; // MJ
  const cb = (TARGET - route.ghgIntensity) * energy; // gCO2e
  return {
    shipId: route.routeId,
    year: route.year,
    cb_gco2eq: cb,
  };
}

export function computeCB(target: number, actual: number, fuelT: number): number {
  return (target - actual) * fuelT * MJ_PER_TONNE;
}

export { TARGET };
