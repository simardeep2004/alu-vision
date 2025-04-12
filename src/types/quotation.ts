
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

export type QuotationItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  // Add dimensions for shutters
  width?: number;
  height?: number;
  area?: number;
};

export type Quotation = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: QuotationStatus;
  items: QuotationItem[];
};
