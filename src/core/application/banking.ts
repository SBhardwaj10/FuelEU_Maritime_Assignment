import { BankRepository, ComplianceRepository } from "../ports/repository";
import { CBRecord, BankEntry } from "../domain/types";

async function bankSurplus(bankRepo: BankRepository, cbRecord: CBRecord) {
  if (cbRecord.cb_gco2eq <= 0) {
    throw new Error("No positive CB to bank");
  }
  const entry: BankEntry = {
    id: `${cbRecord.shipId}-${cbRecord.year}-${Date.now()}`,
    shipId: cbRecord.shipId,
    year: cbRecord.year,
    amount_gco2eq: cbRecord.cb_gco2eq,
  };
  await bankRepo.addBankEntry(entry);
  return entry;
}

async function applyBanked(bankRepo: BankRepository, shipId: string, year: number, amount: number) {
  const entries = await bankRepo.listBankEntries(shipId, year);
  const available = entries.reduce((s, e) => s + e.amount_gco2eq, 0);
  if (amount > available) throw new Error("Insufficient banked balance");
  await bankRepo.debitBank(shipId, year, amount);
  return { applied: amount, before: available, after: available - amount };
}

export { bankSurplus, applyBanked };
