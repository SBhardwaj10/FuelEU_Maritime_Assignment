import { BankRepository } from "../ports/repository";
import { CBRecord, BankEntry } from "../domain/types";
export declare function bankSurplus(bankRepo: BankRepository, cbRecord: CBRecord): Promise<BankEntry>;
export declare function applyBanked(bankRepo: BankRepository, shipId: string, year: number, amount: number): Promise<{
    applied: number;
    before: number;
    after: number;
}>;
