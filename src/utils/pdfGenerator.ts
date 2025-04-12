
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Quotation } from '@/types/quotation';
import { toast } from 'sonner';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateQuotationPdf = (quotation: Quotation): jsPDF => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.setTextColor(66, 130, 180); // Steel blue color
  doc.text('TheAluVision', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Aluminum & Glass Solutions', 105, 28, { align: 'center' });
  
  // Quotation details
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Quotation #${quotation.id}`, 20, 40);
  doc.setFontSize(10);
  doc.text(`Date: ${quotation.date}`, 20, 48);
  doc.text(`Status: ${quotation.status}`, 20, 55);
  
  // Customer details
  doc.setFontSize(12);
  doc.text('Customer Details:', 130, 40);
  doc.setFontSize(10);
  doc.text(`Name: ${quotation.customerName}`, 130, 48);
  doc.text(`Email: ${quotation.customerEmail}`, 130, 55);
  if (quotation.customerPhone) {
    doc.text(`Phone: ${quotation.customerPhone}`, 130, 62);
  }
  if (quotation.customerAddress) {
    doc.text(`Address: ${quotation.customerAddress}`, 130, quotation.customerPhone ? 69 : 62);
  }
  
  // Quotation items table
  const tableColumn = ["Item", "Category", "Specifications", "Quantity", "Unit Price (₹)", "Total (₹)"];
  const tableRows = quotation.items.map(item => {
    // Generate specs text based on item type
    let specs = '';
    if ((item.category === 'Shutter' || item.category === 'OuterFrame' || item.category === 'Glass') && 
        item.width && item.height && item.area) {
      specs = `${item.width}mm × ${item.height}mm = ${item.area}mm²`;
      if (item.perUnitPrice) {
        specs += ` (₹${item.perUnitPrice} per 1000mm²)`;
      }
    }
    
    return [
      item.name,
      item.category,
      specs,
      `${item.quantity} ${item.unit || 'pcs'}`,
      `₹${item.unitPrice.toFixed(2)}`,
      `₹${item.totalPrice.toFixed(2)}`
    ];
  });
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 75,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 130, 180], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240] },
    margin: { top: 75 }
  });
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount: ₹${quotation.total.toFixed(2)}`, 150, finalY, { align: 'right' });
  
  // Notes if available
  if (quotation.notes) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Notes:', 20, finalY + 10);
    doc.setFontSize(9);
    
    // Split notes into multiple lines if needed
    const splitNotes = doc.splitTextToSize(quotation.notes, 170);
    doc.text(splitNotes, 20, finalY + 18);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('TheAluVision - Premium Aluminum & Glass Solutions', 105, pageHeight - 15, { align: 'center' });
  doc.text('Thank you for your business!', 105, pageHeight - 10, { align: 'center' });
  
  return doc;
};

export const downloadQuotationPdf = (quotation: Quotation): void => {
  try {
    const doc = generateQuotationPdf(quotation);
    doc.save(`Quotation-${quotation.id}.pdf`);
    toast.success('Quotation downloaded successfully');
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Error downloading PDF. Please try again.");
  }
};

export const printQuotationPdf = (quotation: Quotation): void => {
  try {
    const doc = generateQuotationPdf(quotation);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
    toast.success('Quotation sent to printer');
  } catch (error) {
    console.error("Error printing PDF:", error);
    toast.error("Error printing PDF. Please try again.");
  }
};
