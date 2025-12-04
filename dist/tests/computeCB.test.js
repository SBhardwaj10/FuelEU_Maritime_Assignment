"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const computeCB_1 = require("../core/application/computeCB");
(0, vitest_1.describe)('computeCB', () => {
    (0, vitest_1.it)('computes positive CB when actual < target', () => {
        const cb = (0, computeCB_1.computeCB)(computeCB_1.TARGET, 80, 10); // 10 t
        (0, vitest_1.expect)(cb).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('computes negative CB when actual > target', () => {
        const cb = (0, computeCB_1.computeCB)(computeCB_1.TARGET, 100, 10);
        (0, vitest_1.expect)(cb).toBeLessThan(0);
    });
});
