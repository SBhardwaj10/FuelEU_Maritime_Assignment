import { CBRecord, BankEntry } from "../../core/domain/types";
import { RouteRepository, ComplianceRepository, BankRepository, PoolRepository } from "../../core/ports/repository";
export declare class InMemoryRouteRepo implements RouteRepository {
    private routes;
    listRoutes(): Promise<RouteRecord[]>;
    setBaseline(routeId: string): Promise<void>;
}
export declare class InMemoryBankRepo implements BankRepository {
    listBankEntries(shipId: string, year: number): Promise<BankEntry[]>;
    addBankEntry(entry: BankEntry): Promise<void>;
    debitBank(shipId: string, year: number, amount: number): Promise<void>;
}
export declare class InMemoryComplianceRepo implements ComplianceRepository {
    private store;
    getCB(shipId: string, year: number): Promise<any>;
    storeCB(record: CBRecord): Promise<void>;
}
export declare class InMemoryPoolRepo implements PoolRepository {
    createPool(year: number, members: any[]): Promise<{
        id: string;
        members: any[];
    }>;
}
