import { RouteRecord, CBRecord, BankEntry, PoolMember } from "../domain/types";

export interface RouteRepository {
  listRoutes(): Promise<RouteRecord[]>;
  setBaseline(routeId: string): Promise<void>;
}

export interface ComplianceRepository {
  getCB(shipId: string, year: number): Promise<CBRecord | null>;
  storeCB(record: CBRecord): Promise<void>;
}

export interface BankRepository {
  listBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
  addBankEntry(entry: BankEntry): Promise<void>;
  debitBank(shipId: string, year: number, amount: number): Promise<void>;
}

export interface PoolRepository {
  createPool(year: number, members: PoolMember[]): Promise<{ id: string; members: PoolMember[] }>;
}
