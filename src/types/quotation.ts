
export type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

export type MaterialType = 'Aluminum' | 'UPVC' | 'Wood' | 'Glass' | 'Accessories';

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
  materialType?: MaterialType;
  finish?: string;  // Finish type (anodized, powder coated, etc.)
  color?: string;  // Color of the item
  thickness?: number;  // Thickness in mm
  installationIncluded?: boolean;  // Whether installation is included
  deliveryDate?: string;  // Expected delivery date
  imageUrl?: string;  // URL to item image
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
  validUntil?: string;  // Quotation validity date
  createdBy?: string;   // User who created the quotation
  lastModified?: string; // Date of last modification
  approvedBy?: string;  // Customer name/signature if approved
  rejectionReason?: string; // Reason if rejected
  termsAndConditions?: string; // Terms and conditions
  discountTotal?: number; // Total discount amount
  taxRate?: number;     // Tax rate percentage
  taxAmount?: number;   // Tax amount
  subtotal?: number;    // Subtotal before tax
  paymentTerms?: string; // Payment terms
  deliveryMethod?: string; // Delivery method
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
  company?: string;      // Company name if business customer
  contactPerson?: string; // Secondary contact person
  customerType?: 'Individual' | 'Business'; // Type of customer
  source?: string;       // How the customer was acquired
  status?: 'Active' | 'Inactive' | 'Lead'; // Customer status
};
