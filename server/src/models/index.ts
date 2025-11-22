import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  phone?: string;
  location?: string;
  createdAt?: Date; // from timestamps option
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'user'], default: 'manager' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    phone: { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export interface IProduct extends Document {
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  description?: string;
  image?: string;
  unitOfMeasure: string;
  minStockLevel: number;
  reorderQuantity: number;
  supplierInfo?: string;
  price: number;
  tags?: string[];
  isActive: boolean;
  location?: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    barcode: String,
    category: { type: String, required: true },
    description: String,
    image: String,
    unitOfMeasure: { type: String, default: 'pcs' },
    minStockLevel: { type: Number, default: 0 },
    reorderQuantity: { type: Number, default: 0 },
    supplierInfo: String,
    price: { type: Number, default: 0 },
    tags: [String],
    isActive: { type: Boolean, default: true },
    location: String,
    stock: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export type OperationType = 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
export type OperationStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Cancelled';

export interface IOperationItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  doneQuantity?: number;
}

export interface IOperation extends Document {
  referenceNumber: string;
  type: OperationType;
  status: OperationStatus;
  scheduleDate: Date;
  contact?: string;
  sourceLocation?: string;
  destinationLocation?: string;
  items: IOperationItem[];
}

const OperationItemSchema = new Schema<IOperationItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    doneQuantity: { type: Number },
  },
  { _id: false }
);

const OperationSchema = new Schema<IOperation>(
  {
    referenceNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment'], required: true },
    status: {
      type: String,
      enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'],
      default: 'Draft',
    },
    scheduleDate: { type: Date, required: true },
    contact: String,
    sourceLocation: String,
    destinationLocation: String,
    items: { type: [OperationItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Operation: Model<IOperation> =
  mongoose.models.Operation || mongoose.model<IOperation>('Operation', OperationSchema);

export interface IStockMovement extends Document {
  type: OperationType;
  referenceNumber: string;
  product: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  locationFrom?: string;
  locationTo?: string;
  contact?: string;
  status?: OperationStatus;
  timestamp: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    type: { type: String, enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment'], required: true },
    referenceNumber: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    locationFrom: String,
    locationTo: String,
    contact: String,
    status: {
      type: String,
      enum: ['Draft', 'Waiting', 'Ready', 'Done', 'Cancelled'],
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

StockMovementSchema.index({ product: 1, timestamp: -1 });

export const StockMovement: Model<IStockMovement> =
  mongoose.models.StockMovement ||
  mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
