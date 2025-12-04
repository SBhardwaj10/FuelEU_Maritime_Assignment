"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const repository_1 = require("../../outbound/inmemory/repository");
const computeCB_1 = require("../../../core/application/computeCB");
const computeComparison_1 = require("../../../core/application/computeComparison");
const banking_1 = require("../../../core/application/banking");
const pooling_1 = require("../../../core/application/pooling");
const router = express_1.default.Router();
const routeRepo = new repository_1.InMemoryRouteRepo();
const bankRepo = new repository_1.InMemoryBankRepo();
const complianceRepo = new repository_1.InMemoryComplianceRepo();
const poolRepo = new repository_1.InMemoryPoolRepo();
router.get('/routes', async (req, res) => {
    const routes = await routeRepo.listRoutes();
    res.json(routes);
});
router.post('/routes/:id/baseline', async (req, res) => {
    const id = req.params.id;
    await routeRepo.setBaseline(id);
    res.status(204).end();
});
router.get('/routes/comparison', async (req, res) => {
    const routes = await routeRepo.listRoutes();
    const baseline = routes.find(r => r.isBaseline) ?? routes[0];
    const rows = routes.filter(r => r.routeId !== baseline.routeId).map(r => (0, computeComparison_1.compareWithBaseline)(baseline, r));
    res.json({ baseline, rows });
});
router.get('/compliance/cb', async (req, res) => {
    const shipId = String(req.query.shipId || req.query.routeId || 'R001');
    const year = Number(req.query.year || 2024);
    const routes = await routeRepo.listRoutes();
    const route = routes.find(r => r.routeId === shipId && r.year === year) ?? routes[0];
    const cb = (0, computeCB_1.computeCBForRoute)(route);
    await complianceRepo.storeCB(cb);
    res.json(cb);
});
router.get('/compliance/adjusted-cb', async (req, res) => {
    const shipId = String(req.query.shipId || 'R001');
    const year = Number(req.query.year || 2024);
    const cb = await complianceRepo.getCB(shipId, year) ?? (0, computeCB_1.computeCBForRoute)((await routeRepo.listRoutes())[0]);
    // naive adjusted: apply bank entries if any
    const banks = await bankRepo.listBankEntries(shipId, year);
    const banked = banks.reduce((s, b) => s + b.amount_gco2eq, 0);
    res.json({ cb_before: cb.cb_gco2eq, banked, cb_after: cb.cb_gco2eq + banked });
});
router.get('/banking/records', async (req, res) => {
    const shipId = String(req.query.shipId || 'R001');
    const year = Number(req.query.year || 2024);
    const records = await bankRepo.listBankEntries(shipId, year);
    res.json(records);
});
router.post('/banking/bank', express_1.default.json(), async (req, res) => {
    const { shipId, year } = req.body;
    // compute CB and bank
    const routes = await routeRepo.listRoutes();
    const route = routes.find(r => r.routeId === shipId && r.year === year) ?? routes[0];
    const cb = (0, computeCB_1.computeCBForRoute)(route);
    try {
        const entry = await (0, banking_1.bankSurplus)(bankRepo, cb);
        res.json(entry);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/banking/apply', express_1.default.json(), async (req, res) => {
    const { shipId, year, amount } = req.body;
    try {
        const result = await (0, banking_1.applyBanked)(bankRepo, shipId, year, Number(amount));
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.post('/pools', express_1.default.json(), async (req, res) => {
    const { year, members } = req.body; // members: [{ shipId, cb_before }]
    // validation: sum(cb_before) >= 0
    const sum = (members || []).reduce((s, m) => s + (m.cb_before || 0), 0);
    if (sum < 0)
        return res.status(400).json({ error: 'Pool sum must be >= 0' });
    // allocate
    const after = (0, pooling_1.allocatePool)(members);
    const pool = await poolRepo.createPool(year || (new Date()).getFullYear(), after);
    res.json({ pool });
});
exports.default = router;
