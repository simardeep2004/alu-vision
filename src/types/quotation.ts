
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

export type QuotationItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  // Add dimensions for measured items
  width?: number;
  height?: number;
  area?: number;
  // Per unit pricing (for area-based calculations)
  perUnitPrice?: number;
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
