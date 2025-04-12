
import { Quotation } from '@/types/quotation';
import { toast } from 'sonner';
import { generateQuotationPdf } from './pdfGenerator';

// In a real application, this would connect to a backend service
// For now, we'll simulate email sending
export const emailQuotation = async (quotation: Quotation, recipientEmail: string = quotation.customerEmail): Promise<boolean> => {
  try {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending quotation ${quotation.id} to ${recipientEmail}`);
        
        // Generate PDF for attachment (in real app, would attach to email)
        try {
          generateQuotationPdf(quotation);
          console.log("PDF generated successfully for email");
        } catch (error) {
          console.error("Error generating PDF for email:", error);
        }
        
        toast.success(`Quotation email sent to ${recipientEmail}`);
        resolve(true);
      }, 1500);
    });
  } catch (error) {
    console.error("Error sending email:", error);
    toast.error("Failed to send email. Please try again.");
    return false;
  }
};

// Function to send welcome email to new customer
export const sendWelcomeEmail = async (customerEmail: string, customerName: string): Promise<boolean> => {
  try {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending welcome email to ${customerEmail}`);
        toast.success(`Welcome email sent to ${customerName}`);
        resolve(true);
      }, 1000);
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    toast.error("Failed to send welcome email.");
    return false;
  }
};

// Function to send follow-up email
export const sendFollowUpEmail = async (quotation: Quotation): Promise<boolean> => {
  try {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending follow-up email for quotation ${quotation.id} to ${quotation.customerEmail}`);
        toast.success(`Follow-up email sent to ${quotation.customerName}`);
        resolve(true);
      }, 1000);
    });
  } catch (error) {
    console.error("Error sending follow-up email:", error);
    toast.error("Failed to send follow-up email.");
    return false;
  }
};
