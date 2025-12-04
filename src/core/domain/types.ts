export type RouteRecord = {
  id: string; // internal id
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumptionT: number; // tonnes
  distanceKm: number;
  totalEmissionsT: number;
  isBaseline?: boolean;
};

export type CBRecord = {
  shipId: string;
  year: number;
  cb_gco2eq: number; // gCO2e
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
