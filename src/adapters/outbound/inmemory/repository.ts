import { RouteRecord, CBRecord, BankEntry } from "../../../core/domain/types";
import { RouteRepository, ComplianceRepository, BankRepository, PoolRepository } from "../../../core/ports/repository";

const seedRoutes: RouteRecord[] = [
  { id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 85.0, fuelConsumptionT: 5000, distanceKm: 12000, totalEmissionsT: 4500, isBaseline: true },
  { id: '2', routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 87.5, fuelConsumptionT: 4800, distanceKm: 11500, totalEmissionsT: 4200 },
  { id: '3', routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 86.0, fuelConsumptionT: 5100, distanceKm: 12500, totalEmissionsT: 4700 },
  { id: '4', routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 88.5, fuelConsumptionT: 4900, distanceKm: 11800, totalEmissionsT: 4300 },
  { id: '5', routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 84.0, fuelConsumptionT: 4950, distanceKm: 11900, totalEmissionsT: 4400 }
];

const bankEntries: BankEntry[] = [];

export class InMemoryRouteRepo implements RouteRepository {
  private routes = seedRoutes.slice();
  async listRoutes() { return this.routes; }
  async setBaseline(routeId: string) {
    this.routes.forEach(r => r.isBaseline = (r.routeId === routeId));
  }
}

export class InMemoryBankRepo implements BankRepository {
  async listBankEntries(shipId: string, year: number) { return bankEntries.filter(e => e.shipId === shipId && e.year === year); }
  async addBankEntry(entry: BankEntry) { bankEntries.push(entry); }
  async debitBank(shipId: string, year: number, amount: number) {
    // debit FIFO
    let remaining = amount;
    for (const e of bankEntries.filter(x => x.shipId === shipId && x.year === year)) {
      if (remaining <= 0) break;
      const take = Math.min(e.amount_gco2eq, remaining);
      e.amount_gco2eq -= take;
      remaining -= take;
    }
    // remove zeroed entries
    for (let i = bankEntries.length - 1; i >= 0; i--) if (bankEntries[i].amount_gco2eq === 0) bankEntries.splice(i, 1);
  }
}

export class InMemoryComplianceRepo implements ComplianceRepository {
  private store: CBRecord[] = [];
  async getCB(shipId: string, year: number) { return this.store.find(r => r.shipId === shipId && r.year === year) ?? null; }
  async storeCB(record: CBRecord) { this.store.push(record); }
}

export class InMemoryPoolRepo implements PoolRepository {
  async createPool(year: number, members: any[]) { return { id: `pool-${Date.now()}`, members }; }
}
