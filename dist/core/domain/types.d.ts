export type RouteRecord = {
    id: string;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumptionT: number;
    distanceKm: number;
    totalEmissionsT: number;
    isBaseline?: boolean;
};
export type CBRecord = {
    shipId: string;
    year: number;
    cb_gco2eq: number;
};
export type BankEntry = {
    id: string;
    shipId: string;
    year: number;
    amount_gco2eq: number;
};
export type PoolMember = {
    shipId: string;
    cb_before: number;
    cb_after?: number;
};
