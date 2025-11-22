import { Router } from 'express';
import { Product, IProduct } from '../models/index';

const router = Router();

const toProductDTO = (p: IProduct) => ({
  id: p.id,
  name: p.name,
  sku: p.sku,
  category: p.category,
  stock: p.stock,
  minStock: p.minStockLevel,
  price: p.price,
  status: p.status,
  image: p.image,
  location: p.location,
  unit: p.unitOfMeasure,
  supplier: p.supplierInfo,
});

// GET /api/products?q=&category=&status=&minPrice=&maxPrice=
router.get('/', async (req, res, next) => {
  try {
    const { q, category, status, minPrice, maxPrice } = req.query as Record<string, string | undefined>;

    const filter: any = { isActive: true };

    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { sku: new RegExp(q, 'i') },
        { supplierInfo: new RegExp(q, 'i') },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ name: 1 });
    return res.json(products.map(toProductDTO));
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const product = await Product.create({
      name: body.name,
      sku: body.sku,
      category: body.category,
      stock: body.stock ?? 0,
      minStockLevel: body.minStock ?? 0,
      price: body.price ?? 0,
      status: body.status ?? 'In Stock',
      image: body.image,
      location: body.location,
      unitOfMeasure: body.unit ?? 'pcs',
      supplierInfo: body.supplier,
      description: body.description,
    });

    return res.status(201).json(toProductDTO(product));
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          name: body.name,
          sku: body.sku,
          category: body.category,
          stock: body.stock,
          minStockLevel: body.minStock,
          price: body.price,
          status: body.status,
          image: body.image,
          location: body.location,
          unitOfMeasure: body.unit,
          supplierInfo: body.supplier,
          description: body.description,
        },
      },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    return res.json(toProductDTO(product));
  } catch (err) {
    next(err);
  }
});

export default router;
