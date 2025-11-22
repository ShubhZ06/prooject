import { Router } from 'express';

const router = Router();

router.get('/kpis', (_req, res) => {
  // TODO: implement KPI aggregation
  return res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/stock-movement', (_req, res) => {
  // TODO: implement stock movement trend data
  return res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/category-distribution', (_req, res) => {
  // TODO: implement category distribution
  return res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
