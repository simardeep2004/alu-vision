
import { Customer, Quotation } from '@/types/quotation';
import { toast } from 'sonner';
import { sendWelcomeEmail } from './emailService';

// Simulate a customer database
let customersDB: Customer[] = [
  {
    id: 'C001',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    address: '123 MG Road, Bangalore',
    notes: 'Interested in premium aluminum windows',
    created: '2025-03-15',
    quotations: ['Q001', 'Q003']
  },
  {
    id: 'C002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 87654 32109',
    address: '456 Anna Salai, Chennai',
    notes: 'Prefers glass doors with frosted finish',
    created: '2025-03-20',
    quotations: ['Q002']
  },
  {
    id: 'C003',
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    phone: '+91 76543 21098',
    address: '789 Park Street, Kolkata',
    created: '2025-03-25',
    quotations: []
  }
];

// Get all customers
export const getAllCustomers = (): Customer[] => {
  return [...customersDB];
};

// Get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return customersDB.find(customer => customer.id === id);
};

// Get customer by email
export const getCustomerByEmail = (email: string): Customer | undefined => {
  return customersDB.find(customer => customer.email.toLowerCase() === email.toLowerCase());
};

// Add new customer
export const addCustomer = async (customer: Omit<Customer, 'id' | 'created' | 'quotations'>): Promise<Customer> => {
  // Check if customer already exists
  const existingCustomer = getCustomerByEmail(customer.email);
  if (existingCustomer) {
    toast.error('Customer with this email already exists.');
    return existingCustomer;
  }

  // Generate ID
  const newId = `C${(customersDB.length + 1).toString().padStart(3, '0')}`;
  
  // Create new customer
  const newCustomer: Customer = {
    ...customer,
    id: newId,
    created: new Date().toISOString().split('T')[0],
    quotations: []
  };
  
  // Add to database
  customersDB.push(newCustomer);
  
  // Send welcome email
  await sendWelcomeEmail(newCustomer.email, newCustomer.name);
  
  toast.success(`Customer ${newCustomer.name} added successfully.`);
  return newCustomer;
};

// Update customer
export const updateCustomer = (id: string, updates: Partial<Omit<Customer, 'id' | 'created'>>): Customer | undefined => {
  const customerIndex = customersDB.findIndex(customer => customer.id === id);
  if (customerIndex === -1) {
    toast.error('Customer not found.');
    return undefined;
  }
  
  // Update customer
  customersDB[customerIndex] = {
    ...customersDB[customerIndex],
    ...updates
  };
  
  toast.success(`Customer ${customersDB[customerIndex].name} updated successfully.`);
  return customersDB[customerIndex];
};

// Delete customer
export const deleteCustomer = (id: string): boolean => {
  const initialLength = customersDB.length;
  customersDB = customersDB.filter(customer => customer.id !== id);
  
  if (customersDB.length < initialLength) {
    toast.success('Customer deleted successfully.');
    return true;
  } else {
    toast.error('Customer not found.');
    return false;
  }
};

// Add quotation to customer
export const addQuotationToCustomer = (customerId: string, quotationId: string): boolean => {
  const customer = getCustomerById(customerId);
  if (!customer) {
    return false;
  }
  
  // Add quotation if not already added
  if (!customer.quotations?.includes(quotationId)) {
    customer.quotations = [...(customer.quotations || []), quotationId];
    return true;
  }
  
  return false;
};

// Get customer from quotation
export const getCustomerFromQuotation = (quotation: Quotation): Customer | undefined => {
  return getCustomerByEmail(quotation.customerEmail);
};

// Get or create customer from quotation
export const getOrCreateCustomerFromQuotation = async (quotation: Quotation): Promise<Customer> => {
  let customer = getCustomerByEmail(quotation.customerEmail);
  
  if (!customer) {
    // Create new customer
    customer = await addCustomer({
      name: quotation.customerName,
      email: quotation.customerEmail,
      phone: quotation.customerPhone,
      address: quotation.customerAddress,
      notes: quotation.notes
    });
  }
  
  // Add quotation to customer
  if (customer) {
    addQuotationToCustomer(customer.id, quotation.id);
  }
  
  return customer;
};
