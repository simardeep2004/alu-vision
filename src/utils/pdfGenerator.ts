
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Quotation } from '@/types/quotation';

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
  
  // Quotation items table
  const tableColumn = ["Item", "Category", "Quantity", "Unit Price (₹)", "Total (₹)"];
  const tableRows = quotation.items.map(item => [
    item.name,
    item.category,
    `${item.quantity} ${item.unit}`,
    `₹${item.unitPrice.toFixed(2)}`,
    `₹${item.totalPrice.toFixed(2)}`
  ]);
  
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 65,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [66, 130, 180], textColor: [255, 255, 255] },
    footStyles: { fillColor: [240, 240, 240] },
    margin: { top: 65 }
  });
  
  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount: ₹${quotation.total.toFixed(2)}`, 150, finalY, { align: 'right' });
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('TheAluVision - Premium Aluminum & Glass Solutions', 105, pageHeight - 15, { align: 'center' });
  doc.text('Thank you for your business!', 105, pageHeight - 10, { align: 'center' });
  
  return doc;
};

export const downloadQuotationPdf = (quotation: Quotation): void => {
  const doc = generateQuotationPdf(quotation);
  doc.save(`Quotation-${quotation.id}.pdf`);
};

export const printQuotationPdf = (quotation: Quotation): void => {
  const doc = generateQuotationPdf(quotation);
  doc.autoPrint();
  window.open(doc.output('bloburl'), '_blank');
};
