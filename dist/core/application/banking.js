"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBanked = exports.bankSurplus = void 0;
async function bankSurplus(bankRepo, cbRecord) {
    if (cbRecord.cb_gco2eq <= 0) {
        throw new Error("No positive CB to bank");
    }
    const entry = {
        id: `${cbRecord.shipId}-${cbRecord.year}-${Date.now()}`,
        shipId: cbRecord.shipId,
        year: cbRecord.year,
        amount_gco2eq: cbRecord.cb_gco2eq,
    };
    await bankRepo.addBankEntry(entry);
    return entry;
}
exports.bankSurplus = bankSurplus;
async function applyBanked(bankRepo, shipId, year, amount) {
    const entries = await bankRepo.listBankEntries(shipId, year);
    const available = entries.reduce((s, e) => s + e.amount_gco2eq, 0);
    if (amount > available)
        throw new Error("Insufficient banked balance");
    await bankRepo.debitBank(shipId, year, amount);
    return { applied: amount, before: available, after: available - amount };
}
exports.applyBanked = applyBanked;
