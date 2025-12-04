"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPoolRepo = exports.InMemoryComplianceRepo = exports.InMemoryBankRepo = exports.InMemoryRouteRepo = void 0;
const seedRoutes = [
    { id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 85.0, fuelConsumptionT: 5000, distanceKm: 12000, totalEmissionsT: 4500, isBaseline: true },
    { id: '2', routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 87.5, fuelConsumptionT: 4800, distanceKm: 11500, totalEmissionsT: 4200 },
    { id: '3', routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 86.0, fuelConsumptionT: 5100, distanceKm: 12500, totalEmissionsT: 4700 },
    { id: '4', routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 88.5, fuelConsumptionT: 4900, distanceKm: 11800, totalEmissionsT: 4300 },
    { id: '5', routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 84.0, fuelConsumptionT: 4950, distanceKm: 11900, totalEmissionsT: 4400 }
];
const bankEntries = [];
class InMemoryRouteRepo {
    constructor() {
        this.routes = seedRoutes.slice();
    }
    async listRoutes() { return this.routes; }
    async setBaseline(routeId) {
        this.routes.forEach(r => r.isBaseline = (r.routeId === routeId));
    }
}
exports.InMemoryRouteRepo = InMemoryRouteRepo;
class InMemoryBankRepo {
    async listBankEntries(shipId, year) { return bankEntries.filter(e => e.shipId === shipId && e.year === year); }
    async addBankEntry(entry) { bankEntries.push(entry); }
    async debitBank(shipId, year, amount) {
        // debit FIFO
        let remaining = amount;
        for (const e of bankEntries.filter(x => x.shipId === shipId && x.year === year)) {
            if (remaining <= 0)
                break;
            const take = Math.min(e.amount_gco2eq, remaining);
            e.amount_gco2eq -= take;
            remaining -= take;
        }
        // remove zeroed entries
        for (let i = bankEntries.length - 1; i >= 0; i--)
            if (bankEntries[i].amount_gco2eq === 0)
                bankEntries.splice(i, 1);
    }
}
exports.InMemoryBankRepo = InMemoryBankRepo;
class InMemoryComplianceRepo {
    constructor() {
        this.store = [];
    }
    async getCB(shipId, year) { return this.store.find(r => r.shipId === shipId && r.year === year) ?? null; }
    async storeCB(record) { this.store.push(record); }
}
exports.InMemoryComplianceRepo = InMemoryComplianceRepo;
class InMemoryPoolRepo {
    async createPool(year, members) { return { id: `pool-${Date.now()}`, members }; }
}
exports.InMemoryPoolRepo = InMemoryPoolRepo;
