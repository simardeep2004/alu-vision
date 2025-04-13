
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

export type QuotationItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;  // Unit type (pcs, set, etc.)
  unitPrice: number;
  totalPrice: number;
  // Add dimensions for measured items
  width?: number;  // Width in mm
  height?: number;  // Height in mm
  area?: number;  // Area in mm²
  // Per unit pricing (for area-based calculations)
  perUnitPrice?: number;  // Price per 1000mm²
  description?: string;
  discount?: number;  // Discount percentage for this item
};

export type Quotation = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  date: string;
  total: number;
  status: QuotationStatus;
  items: QuotationItem[];
  notes?: string;
};

// Add customer type for CRM
export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  created: string;
  quotations?: string[]; // IDs of quotations
};
