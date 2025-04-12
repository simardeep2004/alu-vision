
import { Quotation } from '@/types/quotation';
import { toast } from 'sonner';

// In a real application, this would connect to a backend service
// For now, we'll simulate email sending
export const emailQuotation = async (quotation: Quotation, recipientEmail: string = quotation.customerEmail): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Sending quotation ${quotation.id} to ${recipientEmail}`);
      toast.success(`Email sent to ${recipientEmail}`);
      resolve(true);
    }, 1500);
  });
};
