import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  // TODO: implement list with filters (type, status, date range)
  return res.status(501).json({ message: 'Not implemented yet' });
});

router.post('/', (_req, res) => {
  // TODO: implement create operation
  return res.status(501).json({ message: 'Not implemented yet' });
});

export default router;
