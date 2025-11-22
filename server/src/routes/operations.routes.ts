import { Router } from 'express';
import { Operation, IOperation, OperationStatus, OperationType } from '../models/index';

const router = Router();

const toOperationDTO = (op: IOperation) => ({
  id: op.id,
  reference: op.referenceNumber,
  type: op.type as OperationType,
  status: op.status as OperationStatus,
  scheduleDate: op.scheduleDate.toISOString().split('T')[0],
  contact: op.contact,
  sourceLocation: op.sourceLocation,
  destinationLocation: op.destinationLocation,
  items: op.items.map((i) => ({
    productId: i.product.toString(),
    productName: i.productName,
    sku: i.sku,
    quantity: i.quantity,
    doneQuantity: i.doneQuantity,
  })),
});

// Optional initial seed so UI is not empty on first run
const seedOperations: Partial<IOperation>[] = [
  {
    referenceNumber: 'WH/IN/0001',
    type: 'Receipt',
    status: 'Done',
    scheduleDate: new Date('2024-10-24'),
    contact: 'TechGlobal',
    sourceLocation: 'Vendor',
    destinationLocation: 'WH/Stock',
    items: [],
  },
  {
    referenceNumber: 'WH/OUT/0001',
    type: 'Delivery',
    status: 'Ready',
    scheduleDate: new Date('2024-10-24'),
    contact: 'CyberDyne',
    sourceLocation: 'WH/Stock',
    destinationLocation: 'Customer',
    items: [],
  },
  {
    referenceNumber: 'WH/INT/0001',
    type: 'Transfer',
    status: 'Draft',
    scheduleDate: new Date('2024-10-26'),
    sourceLocation: 'WH/Stock',
    destinationLocation: 'WH/Output',
    items: [],
  },
  {
    referenceNumber: 'WH/IN/0002',
    type: 'Receipt',
    status: 'Draft',
    scheduleDate: new Date('2024-11-01'),
    contact: 'RawMaterials Co.',
    sourceLocation: 'Vendor',
    destinationLocation: 'WH/Stock',
    items: [],
  },
];

// GET /api/operations?type=&status=&q=
router.get('/', async (req, res, next) => {
  try {
    // Seed on empty collection for nicer first-time UX
    const count = await Operation.estimatedDocumentCount();
    if (count === 0) {
      await Operation.insertMany(seedOperations);
    }

    const { type, status, q } = req.query as {
      type?: string;
      status?: string;
      q?: string;
    };

    const filter: any = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { referenceNumber: new RegExp(q, 'i') },
        { contact: new RegExp(q, 'i') },
      ];
    }

    const ops = await Operation.find(filter).sort({ scheduleDate: 1, createdAt: -1 });
    return res.json(ops.map(toOperationDTO));
  } catch (err) {
    next(err);
  }
});

// POST /api/operations
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;

    const op = await Operation.create({
      referenceNumber: body.reference,
      type: body.type,
      status: body.status || 'Draft',
      scheduleDate: new Date(body.scheduleDate),
      contact: body.contact,
      sourceLocation: body.sourceLocation,
      destinationLocation: body.destinationLocation,
      items: Array.isArray(body.items)
        ? body.items.map((i: any) => ({
            product: i.productId,
            productName: i.productName,
            sku: i.sku,
            quantity: i.quantity,
            doneQuantity: i.doneQuantity,
          }))
        : [],
    });

    return res.status(201).json(toOperationDTO(op));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/operations/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: OperationStatus };

    const op = await Operation.findByIdAndUpdate(id, { status }, { new: true });
    if (!op) return res.status(404).json({ message: 'Operation not found' });

    return res.json(toOperationDTO(op));
  } catch (err) {
    next(err);
  }
});

export default router;
