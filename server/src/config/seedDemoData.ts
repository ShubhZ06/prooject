import { Product, Operation, StockMovement, IProduct, IOperation } from '../models/index';

// Seed demo data for products, operations, and stock movements so that
// the frontend screens can use the database instead of hardcoded mocks.

const productSeedData: Array<Partial<IProduct> & { sku: string }> = [
  { name: 'NanoTech Chipset X1', sku: 'NC-X1', category: 'Electronics', stock: 154, minStockLevel: 20, price: 450, status: 'In Stock', image: 'https://picsum.photos/400/300?random=1', location: 'A-12-04', unitOfMeasure: 'pcs', supplierInfo: 'TechGlobal' },
  { name: 'Quantum Sensor Module', sku: 'QS-M2', category: 'Electronics', stock: 12, minStockLevel: 15, price: 1250, status: 'Low Stock', image: 'https://picsum.photos/400/300?random=2', location: 'B-05-11', unitOfMeasure: 'pcs', supplierInfo: 'QuantumSys' },
  { name: 'Hydraulic Piston V4', sku: 'HP-V4', category: 'Tools', stock: 85, minStockLevel: 10, price: 320, status: 'In Stock', image: 'https://picsum.photos/400/300?random=3', location: 'C-01-02', unitOfMeasure: 'set', supplierInfo: 'MechParts' },
  { name: 'Carbon Fiber Sheet', sku: 'CF-S9', category: 'Materials', stock: 0, minStockLevel: 50, price: 95, status: 'Out of Stock', image: 'https://picsum.photos/400/300?random=4', location: 'D-22-01', unitOfMeasure: 'sqm', supplierInfo: 'MatWorld' },
  { name: 'OLED Display 4K', sku: 'OD-4K', category: 'Electronics', stock: 45, minStockLevel: 20, price: 899, status: 'In Stock', image: 'https://picsum.photos/400/300?random=5', location: 'A-14-02', unitOfMeasure: 'pcs', supplierInfo: 'DisplayTech' },
  { name: 'Wireless Controller', sku: 'WC-01', category: 'Electronics', stock: 200, minStockLevel: 30, price: 59, status: 'In Stock', image: 'https://picsum.photos/400/300?random=6', location: 'E-02-05', unitOfMeasure: 'pcs', supplierInfo: 'GameGear' },
  { name: 'Industrial Servo Motor', sku: 'ISM-900', category: 'Tools', stock: 22, minStockLevel: 5, price: 1200, status: 'In Stock', image: 'https://picsum.photos/400/300?random=7', location: 'C-05-01', unitOfMeasure: 'pcs', supplierInfo: 'MechParts' },
  { name: 'Thermal Paste 5g', sku: 'TP-5G', category: 'Materials', stock: 500, minStockLevel: 100, price: 15, status: 'In Stock', image: 'https://picsum.photos/400/300?random=8', location: 'D-01-01', unitOfMeasure: 'tube', supplierInfo: 'CoolTech' },
  { name: 'Safety Goggles Pro', sku: 'SG-Pro', category: 'Safety Gear', stock: 120, minStockLevel: 20, price: 25, status: 'In Stock', image: 'https://picsum.photos/400/300?random=9', location: 'S-01-01', unitOfMeasure: 'pcs', supplierInfo: 'SafetyFirst' },
  { name: 'Packaging Foam Roll', sku: 'PF-Roll', category: 'Packaging', stock: 8, minStockLevel: 10, price: 45, status: 'Low Stock', image: 'https://picsum.photos/400/300?random=10', location: 'P-10-05', unitOfMeasure: 'roll', supplierInfo: 'PackIt' },
];

const operationSeedData = [
  { reference: 'WH/IN/0001', type: 'Receipt', status: 'Done', scheduleDate: '2024-10-24', contact: 'TechGlobal', sourceLocation: 'Vendor', destinationLocation: 'WH/Stock' },
  { reference: 'WH/OUT/0001', type: 'Delivery', status: 'Ready', scheduleDate: '2024-10-24', contact: 'CyberDyne', sourceLocation: 'WH/Stock', destinationLocation: 'Customer' },
  { reference: 'WH/INT/0001', type: 'Transfer', status: 'Draft', scheduleDate: '2024-10-26', contact: undefined, sourceLocation: 'WH/Stock', destinationLocation: 'WH/Output' },
  { reference: 'WH/IN/0002', type: 'Receipt', status: 'Draft', scheduleDate: '2024-11-01', contact: 'RawMaterials Co.', sourceLocation: 'Vendor', destinationLocation: 'WH/Stock' },
] as const;

const movementSeedData = [
  {
    id: 'm1',
    date: '2024-10-24',
    time: '14:30',
    product: 'NanoTech Chipset X1',
    sku: 'NC-X1',
    type: 'Receipt',
    reference: 'WH/IN/0001',
    quantity: 120,
    locationFrom: 'Vendor',
    locationTo: 'WH/Stock1',
    contact: 'Azure Interior',
    status: 'Done',
  },
  {
    id: 'm2',
    date: '2024-10-24',
    time: '11:15',
    product: 'Quantum Sensor Module',
    sku: 'QS-M2',
    type: 'Receipt',
    reference: 'WH/IN/0001',
    quantity: 50,
    locationFrom: 'Vendor',
    locationTo: 'WH/Stock1',
    contact: 'Azure Interior',
    status: 'Done',
  },
  {
    id: 'm3',
    date: '2024-10-23',
    time: '16:45',
    product: 'Hydraulic Piston V4',
    sku: 'HP-V4',
    type: 'Delivery',
    reference: 'WH/OUT/0002',
    quantity: 5,
    locationFrom: 'WH/Stock1',
    locationTo: 'Customer',
    contact: 'Deco Addict',
    status: 'Done',
  },
  {
    id: 'm4',
    date: '2024-10-23',
    time: '09:20',
    product: 'OLED Display 4K',
    sku: 'OD-4K',
    type: 'Delivery',
    reference: 'WH/OUT/0003',
    quantity: 2,
    locationFrom: 'WH/Stock2',
    locationTo: 'Customer',
    contact: 'Gemini Furniture',
    status: 'Ready',
  },
] as const;

export const seedDemoData = async () => {
  // PRODUCTS
  const productCount = await Product.estimatedDocumentCount();
  if (productCount === 0) {
    await Product.insertMany(
      productSeedData.map((p) => ({
        name: p.name!,
        sku: p.sku,
        category: p.category!,
        stock: p.stock ?? 0,
        minStockLevel: p.minStockLevel ?? 0,
        price: p.price ?? 0,
        status: p.status ?? 'In Stock',
        image: p.image,
        location: p.location,
        unitOfMeasure: p.unitOfMeasure ?? 'pcs',
        supplierInfo: p.supplierInfo,
        isActive: true,
      }))
    );
    console.log('Seeded demo products');
  }

  // OPERATIONS
  const opCount = await Operation.estimatedDocumentCount();
  if (opCount === 0) {
    await Operation.insertMany(
      operationSeedData.map((o) => ({
        referenceNumber: o.reference,
        type: o.type,
        status: o.status,
        scheduleDate: new Date(o.scheduleDate),
        contact: o.contact,
        sourceLocation: o.sourceLocation,
        destinationLocation: o.destinationLocation,
        items: [],
      }))
    );
    console.log('Seeded demo operations');
  }

  // STOCK MOVEMENTS
  const movementCount = await StockMovement.estimatedDocumentCount();
  if (movementCount === 0) {
    const skus = Array.from(new Set(movementSeedData.map((m) => m.sku)));
    const products = await Product.find({ sku: { $in: skus } });
    const skuMap = new Map(products.map((p) => [p.sku, p]));

    const docs = movementSeedData
      .map((m) => {
        const prod = skuMap.get(m.sku);
        if (!prod) return null;
        return {
          type: m.type,
          referenceNumber: m.reference,
          product: prod._id,
          productName: m.product,
          sku: m.sku,
          quantity: m.quantity,
          locationFrom: m.locationFrom,
          locationTo: m.locationTo,
          contact: m.contact,
          status: m.status,
          timestamp: new Date(`${m.date}T${m.time}:00Z`),
        };
      })
      .filter((d): d is Parameters<typeof StockMovement.insertMany>[0] => Boolean(d));

    if (docs.length > 0) {
      await StockMovement.insertMany(docs as any);
      console.log('Seeded demo stock movements');
    }
  }
};
