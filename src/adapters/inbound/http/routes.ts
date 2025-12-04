import express from "express";
import { InMemoryRouteRepo, InMemoryBankRepo, InMemoryComplianceRepo, InMemoryPoolRepo } from "../../outbound/inmemory/repository";
import { computeCBForRoute } from "../../../core/application/computeCB";
import { compareWithBaseline } from "../../../core/application/computeComparison";
import { bankSurplus, applyBanked } from "../../../core/application/banking";
import { allocatePool } from "../../../core/application/pooling";

const router = express.Router();

const routeRepo = new InMemoryRouteRepo();
const bankRepo = new InMemoryBankRepo();
const complianceRepo = new InMemoryComplianceRepo();
const poolRepo = new InMemoryPoolRepo();

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
  const rows = routes.filter(r => r.routeId !== baseline.routeId).map(r => compareWithBaseline(baseline, r));
  res.json({ baseline, rows });
});

router.get('/compliance/cb', async (req, res) => {
  const shipId = String(req.query.shipId || req.query.routeId || 'R001');
  const year = Number(req.query.year || 2024);
  const routes = await routeRepo.listRoutes();
  const route = routes.find(r => r.routeId === shipId && r.year === year) ?? routes[0];
  const cb = computeCBForRoute(route);
  await complianceRepo.storeCB(cb);
  res.json(cb);
});

router.get('/compliance/adjusted-cb', async (req, res) => {
  const shipId = String(req.query.shipId || 'R001');
  const year = Number(req.query.year || 2024);
  const cb = await complianceRepo.getCB(shipId, year) ?? computeCBForRoute((await routeRepo.listRoutes())[0]);
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

router.post('/banking/bank', express.json(), async (req, res) => {
  const { shipId, year } = req.body;
  // compute CB and bank
  const routes = await routeRepo.listRoutes();
  const route = routes.find(r => r.routeId === shipId && r.year === year) ?? routes[0];
  const cb = computeCBForRoute(route);
  try {
    const entry = await bankSurplus(bankRepo, cb);
    res.json(entry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/banking/apply', express.json(), async (req, res) => {
  const { shipId, year, amount } = req.body;
  try {
    const result = await applyBanked(bankRepo, shipId, year, Number(amount));
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/pools', express.json(), async (req, res) => {
  const { year, members } = req.body; // members: [{ shipId, cb_before }]
  // validation: sum(cb_before) >= 0
  const sum = (members || []).reduce((s: number, m: any) => s + (m.cb_before || 0), 0);
  if (sum < 0) return res.status(400).json({ error: 'Pool sum must be >= 0' });
  // allocate
  const after = allocatePool(members);
  const pool = await poolRepo.createPool(year || (new Date()).getFullYear(), after);
  res.json({ pool });
});

export default router;
