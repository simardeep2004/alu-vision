
import { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Download, 
  Printer, 
  Mail, 
  Eye, 
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { downloadQuotationPdf, printQuotationPdf } from '@/utils/pdfGenerator';
import { emailQuotation } from '@/utils/emailService';
import { Quotation, QuotationStatus } from '@/types/quotation';

// Mock data
const quotationsData: Quotation[] = [
  {
    id: 'Q-2023-001',
    customerName: 'Acme Construction Inc.',
    customerEmail: 'info@acmeconstruction.com',
    date: '2023-10-15',
    total: 2450.75,
    status: 'Approved',
    items: [
      {
        id: '001',
        name: 'Aluminum Profile A-101',
        category: 'Profiles',
        quantity: 20,
        unit: 'pcs',
        unitPrice: 45.99,
        totalPrice: 919.80,
      },
      {
        id: '002',
        name: 'Clear Glass 6mm',
        category: 'Glass',
        quantity: 30,
        unit: 'sqm',
        unitPrice: 25.50,
        totalPrice: 765.00,
      },
      {
        id: '003',
        name: 'Handle Type B',
        category: 'Accessories',
        quantity: 10,
        unit: 'pcs',
        unitPrice: 8.75,
        totalPrice: 87.50,
      },
      {
        id: '006',
        name: 'Corner Joint CJ-101',
        category: 'Accessories',
        quantity: 40,
        unit: 'pcs',
        unitPrice: 2.50,
        totalPrice: 100.00,
      },
      {
        id: '008',
        name: 'Silicon Sealant',
        category: 'Consumables',
        quantity: 5,
        unit: 'tubes',
        unitPrice: 7.99,
        totalPrice: 39.95,
      },
    ],
  },
  {
    id: 'Q-2023-002',
    customerName: 'Modern Homes Ltd.',
    customerEmail: 'sales@modernhomes.com',
    date: '2023-10-10',
    total: 1850.25,
    status: 'Sent',
    items: [
      {
        id: '001',
        name: 'Aluminum Profile A-101',
        category: 'Profiles',
        quantity: 15,
        unit: 'pcs',
        unitPrice: 45.99,
        totalPrice: 689.85,
      },
      {
        id: '005',
        name: 'Tinted Glass 8mm',
        category: 'Glass',
        quantity: 25,
        unit: 'sqm',
        unitPrice: 35.75,
        totalPrice: 893.75,
      },
      {
        id: '003',
        name: 'Handle Type B',
        category: 'Accessories',
        quantity: 8,
        unit: 'pcs',
        unitPrice: 8.75,
        totalPrice: 70.00,
      },
    ],
  },
  {
    id: 'Q-2023-003',
    customerName: 'City Developers',
    customerEmail: 'projects@citydevelopers.com',
    date: '2023-10-05',
    total: 980.50,
    status: 'Draft',
    items: [
      {
        id: '007',
        name: 'Aluminum Profile B-202',
        category: 'Profiles',
        quantity: 8,
        unit: 'pcs',
        unitPrice: 52.25,
        totalPrice: 418.00,
      },
      {
        id: '002',
        name: 'Clear Glass 6mm',
        category: 'Glass',
        quantity: 15,
        unit: 'sqm',
        unitPrice: 25.50,
        totalPrice: 382.50,
      },
      {
        id: '008',
        name: 'Silicon Sealant',
        category: 'Consumables',
        quantity: 10,
        unit: 'tubes',
        unitPrice: 7.99,
        totalPrice: 79.90,
      },
    ],
  },
  {
    id: 'Q-2023-004',
    customerName: 'Elite Interiors',
    customerEmail: 'orders@eliteinteriors.com',
    date: '2023-09-28',
    total: 3150.00,
    status: 'Rejected',
    items: [
      {
        id: '001',
        name: 'Aluminum Profile A-101',
        category: 'Profiles',
        quantity: 25,
        unit: 'pcs',
        unitPrice: 45.99,
        totalPrice: 1149.75,
      },
      {
        id: '005',
        name: 'Tinted Glass 8mm',
        category: 'Glass',
        quantity: 40,
        unit: 'sqm',
        unitPrice: 35.75,
        totalPrice: 1430.00,
      },
      {
        id: '004',
        name: 'Sliding Mechanism SL-200',
        category: 'Hardware',
        quantity: 8,
        unit: 'sets',
        unitPrice: 65.00,
        totalPrice: 520.00,
      },
    ],
  },
];

const Quotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>(quotationsData);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [isEmailing, setIsEmailing] = useState(false);
  
  // Filter quotations based on status
  const filteredQuotations = quotations.filter(quotation => {
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesStatus;
  });
  
  // Sort quotations
  const sortedQuotations = [...filteredQuotations].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime() 
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
    }
  });
  
  // Toggle sort order
  const toggleSort = (field: 'date' | 'total') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  // Handle delete quotation
  const handleDeleteQuotation = () => {
    if (!quotationToDelete) return;
    
    const updatedQuotations = quotations.filter(q => q.id !== quotationToDelete);
    setQuotations(updatedQuotations);
    setIsDeleteDialogOpen(false);
    setQuotationToDelete(null);
    toast.success('Quotation deleted successfully');
  };
  
  // Handle email quotation
  const handleEmailQuotation = async (quotation: Quotation) => {
    setIsEmailing(true);
    try {
      await emailQuotation(quotation, emailRecipient || quotation.customerEmail);
      setIsEmailDialogOpen(false);
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsEmailing(false);
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: QuotationStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Quotations</h1>
        <Button 
          className="mt-4 md:mt-0 bg-alu-primary hover:bg-alu-primary/90"
          onClick={() => navigate('/quotation-builder')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Quotation
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-end">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Quotations Table */}
      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      sortOrder === 'asc' ? 
                        <ArrowUp className="ml-1" size={14} /> : 
                        <ArrowDown className="ml-1" size={14} />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => toggleSort('total')}
                >
                  <div className="flex items-center justify-end">
                    Total
                    {sortField === 'total' && (
                      sortOrder === 'asc' ? 
                        <ArrowUp className="ml-1" size={14} /> : 
                        <ArrowDown className="ml-1" size={14} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedQuotations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText size={24} className="mb-2" />
                      <p>No quotations found. Try adjusting your filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedQuotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quotation.customerName}</div>
                        <div className="text-sm text-gray-500">{quotation.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{quotation.date}</TableCell>
                    <TableCell className="text-right">₹{quotation.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quotation.status)}>
                        {quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setIsViewDialogOpen(true);
                          }}
                          title="View"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedQuotation(quotation);
                            setEmailRecipient(quotation.customerEmail);
                            setIsEmailDialogOpen(true);
                          }}
                          title="Email"
                        >
                          <Mail size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => printQuotationPdf(quotation)}
                          title="Print"
                        >
                          <Printer size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadQuotationPdf(quotation)}
                          title="Download"
                        >
                          <Download size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => {
                            setQuotationToDelete(quotation.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* View Quotation Dialog */}
      {selectedQuotation && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quotation {selectedQuotation.id}</DialogTitle>
              <DialogDescription>
                Created on {selectedQuotation.date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                  <p className="font-medium">{selectedQuotation.customerName}</p>
                  <p className="text-sm">{selectedQuotation.customerEmail}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <Badge className={`${getStatusColor(selectedQuotation.status)} inline-flex`}>
                    {selectedQuotation.status === 'Approved' && <CheckCircle2 size={14} className="mr-1" />}
                    {selectedQuotation.status === 'Rejected' && <XCircle size={14} className="mr-1" />}
                    {selectedQuotation.status}
                  </Badge>
                </div>
              </div>
              
              {/* Items Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price (₹)</TableHead>
                        <TableHead className="text-right">Total (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedQuotation.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                          <TableCell className="text-right">₹{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">₹{item.totalPrice.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">₹{selectedQuotation.total.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  setEmailRecipient(selectedQuotation.customerEmail);
                  setIsEmailDialogOpen(true);
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => printQuotationPdf(selectedQuotation)}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button
                onClick={() => downloadQuotationPdf(selectedQuotation)}
                className="bg-alu-primary hover:bg-alu-primary/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Quotation</DialogTitle>
            <DialogDescription>
              Send this quotation to the customer or other recipients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium">
                Recipient Email
              </label>
              <Input
                id="recipient"
                type="email"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
                placeholder="customer@example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline" 
              onClick={() => setIsEmailDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => selectedQuotation && handleEmailQuotation(selectedQuotation)}
              className="bg-alu-primary hover:bg-alu-primary/90"
              disabled={isEmailing}
            >
              {isEmailing ? 'Sending...' : 'Send Email'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quotation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuotation}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quotations;
