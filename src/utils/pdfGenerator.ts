
import { Quotation } from "@/types/quotation";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export const downloadQuotationPdf = (quotation: Quotation) => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  doc.text("TheAluVision", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Aluminum and Glass Solutions", 105, 27, { align: "center" });
  doc.text("Delhi NCR, India", 105, 33, { align: "center" });
  doc.text("Email: info@thealuvision.com", 105, 39, { align: "center" });
  
  // Add quotation details
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Quotation #${quotation.id}`, 14, 50);
  
  doc.setFontSize(11);
  doc.text(`Date: ${new Date(quotation.date).toLocaleDateString()}`, 14, 60);
  doc.text(`Status: ${quotation.status}`, 14, 67);
  
  // Customer details
  doc.setFontSize(12);
  doc.text("Customer Details:", 14, 80);
  doc.setFontSize(11);
  doc.text(`Name: ${quotation.customerName}`, 14, 88);
  doc.text(`Email: ${quotation.customerEmail}`, 14, 95);
  if (quotation.customerPhone) {
    doc.text(`Phone: ${quotation.customerPhone}`, 14, 102);
  }
  if (quotation.customerAddress) {
    const addressLines = quotation.customerAddress.split('\n');
    let yPos = 109;
    doc.text("Address:", 14, yPos);
    addressLines.forEach((line, index) => {
      doc.text(line, 28, yPos + (index + 1) * 7);
    });
  }
  
  // Items table
  const tableColumn = ["Item", "Category", "Quantity", "Unit Price (₹)", "Total (₹)"];
  const tableRows = quotation.items.map(item => {
    let itemName = item.name;
    if (item.width && item.height) {
      itemName += ` (${item.width}mm x ${item.height}mm)`;
    }
    return [
      itemName,
      item.category,
      item.quantity.toString(),
      item.unitPrice.toFixed(2),
      item.totalPrice.toFixed(2)
    ];
  });
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 130,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 51, 102] }
  });
  
  // Calculate final y-position after the table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Add summary of costs
  const subtotal = quotation.items.reduce((sum, item) => sum + item.totalPrice, 0);
  // Assuming tax of 18% GST for India
  const tax = subtotal * 0.18;
  
  doc.setFontSize(10);
  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 135, finalY + 10);
  doc.text(`GST (18%): ₹${tax.toFixed(2)}`, 135, finalY + 17);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: ₹${quotation.total.toFixed(2)}`, 135, finalY + 27);
  doc.setFont(undefined, 'normal');
  
  // Add notes if available
  if (quotation.notes) {
    doc.setFontSize(11);
    doc.text("Notes:", 14, finalY + 40);
    doc.setFontSize(10);
    
    const splitNotes = doc.splitTextToSize(quotation.notes, 180);
    doc.text(splitNotes, 14, finalY + 48);
  }
  
  // Add terms and conditions
  doc.setFontSize(10);
  const termsY = quotation.notes ? finalY + 60 + (doc.getTextDimensions(quotation.notes).h) : finalY + 60;
  doc.text("Terms & Conditions:", 14, termsY);
  doc.setFontSize(9);
  
  const terms = [
    "1. Quotation valid for 30 days from the date of issue.",
    "2. 50% advance payment required to confirm the order.",
    "3. Delivery timeline: 10-15 working days after confirmation.",
    "4. Transportation charges extra as applicable.",
    "5. GST 18% included in the quotation."
  ];
  
  terms.forEach((term, index) => {
    doc.text(term, 14, termsY + 7 + (index * 6));
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `TheAluVision - Delhi NCR, India - Generated on ${new Date().toLocaleString()}`,
      105, 
      285, 
      { align: "center" }
    );
  }
  
  // Download the PDF
  doc.save(`Quotation-${quotation.id}.pdf`);
  
  return doc;
};

export const printQuotationPdf = (quotation: Quotation) => {
  const doc = downloadQuotationPdf(quotation);
  doc.autoPrint();
  doc.output('dataurlnewwindow');
};
