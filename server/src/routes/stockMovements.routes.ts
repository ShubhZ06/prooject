import { Router } from 'express';
import { StockMovement, IStockMovement, OperationStatus } from '../models/index';

const router = Router();

const toMovementDTO = (m: IStockMovement) => ({
  id: m.id,
  date: m.timestamp.toISOString().split('T')[0],
  time: m.timestamp.toISOString().split('T')[1].slice(0, 5),
  product: m.productName,
  sku: m.sku,
  type: m.type,
  reference: m.referenceNumber,
  quantity: m.quantity,
  locationFrom: m.locationFrom,
  locationTo: m.locationTo,
  contact: m.contact,
  status: m.status,
});

// GET /api/stock-movements?status=&q=
router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query as { status?: string; q?: string };
    const filter: any = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { referenceNumber: new RegExp(q, 'i') },
        { contact: new RegExp(q, 'i') },
        { productName: new RegExp(q, 'i') },
      ];
    }
    const moves = await StockMovement.find(filter).sort({ timestamp: -1 });
    res.json(moves.map(toMovementDTO));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/stock-movements/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: OperationStatus };
    const move = await StockMovement.findByIdAndUpdate(id, { status }, { new: true });
    if (!move) return res.status(404).json({ message: 'Stock movement not found' });
    res.json(toMovementDTO(move));
  } catch (err) {
    next(err);
  }
});

export default router;
