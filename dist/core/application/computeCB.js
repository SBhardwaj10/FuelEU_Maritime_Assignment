"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET = exports.computeCB = exports.computeCBForRoute = void 0;
const TARGET = 89.3368; // gCO2e/MJ
exports.TARGET = TARGET;
const MJ_PER_TONNE = 41000; // MJ/t
function computeCBForRoute(route) {
    const energy = route.fuelConsumptionT * MJ_PER_TONNE; // MJ
    const cb = (TARGET - route.ghgIntensity) * energy; // gCO2e
    return {
        shipId: route.routeId,
        year: route.year,
        cb_gco2eq: cb,
    };
}
exports.computeCBForRoute = computeCBForRoute;
function computeCB(target, actual, fuelT) {
    return (target - actual) * fuelT * MJ_PER_TONNE;
}
exports.computeCB = computeCB;
