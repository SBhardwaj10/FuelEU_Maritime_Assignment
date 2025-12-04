"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allocatePool = void 0;
// Greedy allocation: sort by cb_before desc, transfer surplus to deficits
function allocatePool(members) {
    // clone
    const m = members.map((x) => ({ ...x }));
    m.sort((a, b) => b.cb_before - a.cb_before);
    let i = 0; // surplus index
    let j = m.length - 1; // deficit index
    while (i < j) {
        if (m[i].cb_before <= 0) {
            i++;
            continue;
        }
        if (m[j].cb_before >= 0) {
            j--;
            continue;
        }
        const transfer = Math.min(m[i].cb_before, -m[j].cb_before);
        m[i].cb_before -= transfer;
        m[j].cb_before += transfer;
        if (m[i].cb_after === undefined)
            m[i].cb_after = 0;
        if (m[j].cb_after === undefined)
            m[j].cb_after = 0;
        // We will set cb_after at the end
        if (m[i].cb_before <= 0)
            i++;
        if (m[j].cb_before >= 0)
            j--;
    }
    // finalize cb_after: original cb_before was mutated; for clarity return cb_after as current value
    return m.map((x) => ({ shipId: x.shipId, cb_before: x.cb_before, cb_after: x.cb_before }));
}
exports.allocatePool = allocatePool;
