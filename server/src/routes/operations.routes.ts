import { Router } from 'express';
import { Operation, IOperation } from '../models/index';

const router = Router();

const toOperationDTO = (o: IOperation) => ({
  id: o.id,
  reference: o.referenceNumber,
  type: o.type,
  status: o.status,
  scheduleDate: o.scheduleDate.toISOString().split('T')[0],
  contact: o.contact,
  sourceLocation: o.sourceLocation,
  destinationLocation: o.destinationLocation,
  items: o.items.map((item) => ({
    productId: item.product.toString(),
    productName: item.productName,
    sku: item.sku,
    quantity: item.quantity,
    doneQuantity: item.doneQuantity ?? 0,
  })),
});

// GET /api/operations?type=&status=&q=
router.get('/', async (req, res, next) => {
  try {
    const { type, status, q } = req.query as Record<string, string | undefined>;

    const filter: any = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { referenceNumber: new RegExp(q, 'i') },
        { contact: new RegExp(q, 'i') },
      ];
    }

    const ops = await Operation.find(filter).sort({ scheduleDate: -1 });
    return res.json(ops.map(toOperationDTO));
  } catch (err) {
    next(err);
  }
});

export default router;
