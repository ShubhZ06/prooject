
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  location: string;
  barcode?: string;
  supplier?: string;
  description?: string;
  unit?: string;
  lastUpdated?: string;
  warehouses?: { name: string; stock: number }[];
  cost?: number; // Added unit cost
}

export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: 'box' | 'alert' | 'truck' | 'check';
  color: 'ocean' | 'amber' | 'teal' | 'rose';
}

export type OperationType = 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
export type OperationStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Cancelled';

export interface OperationItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number; // Demand/Requested
  doneQuantity?: number; // Actually processed
  stockAvailable?: number; // For checking availability
}

export interface Operation {
  id: string;
  reference: string;
  type: OperationType;
  status: OperationStatus;
  scheduleDate: string; // Changed from date to scheduleDate
  
  // Unified contact field (Supplier for Receipt, Customer for Delivery)
  contact?: string;
  
  sourceLocation?: string; // From
  destinationLocation?: string; // To
  
  items: OperationItem[];
  responsible?: string;
  notes?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  time: string;
  product: string;
  sku: string;
  type: OperationType;
  reference: string;
  quantity: number;
  locationFrom?: string;
  locationTo?: string;
  contact?: string;
  status?: 'Draft' | 'Ready' | 'Done' | 'Cancelled';
}
