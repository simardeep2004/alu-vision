
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit,
  Mail,
  User,
  Phone,
  MapPin,
  Clock,
  FileText,
  Search,
  ChevronDown,
  MoreHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { Customer } from '@/types/quotation';
import { getAllCustomers, addCustomer, updateCustomer, deleteCustomer } from '@/utils/crmService';
import { sendWelcomeEmail } from '@/utils/emailService';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  // Load customers
  useEffect(() => {
    const loadCustomers = () => {
      const data = getAllCustomers();
      setCustomers(data);
    };
    
    loadCustomers();
  }, []);
  
  // Filtered customers
  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      (customer.phone && customer.phone.toLowerCase().includes(query)) ||
      (customer.address && customer.address.toLowerCase().includes(query))
    );
  });
  
  // Handle add customer
  const handleAddCustomer = async () => {
    if (!name || !email) {
      toast.error('Name and email are required.');
      return;
    }
    
    const newCustomer = await addCustomer({
      name,
      email,
      phone,
      address,
      notes
    });
    
    setCustomers([...customers, newCustomer]);
    resetForm();
    setIsAddDialogOpen(false);
  };
  
  // Handle edit customer
  const handleEditCustomer = () => {
    if (!editCustomerId || !name || !email) {
      toast.error('Name and email are required.');
      return;
    }
    
    const updatedCustomer = updateCustomer(editCustomerId, {
      name,
      email,
      phone,
      address,
      notes
    });
    
    if (updatedCustomer) {
      setCustomers(customers.map(c => c.id === editCustomerId ? updatedCustomer : c));
      resetForm();
      setIsEditDialogOpen(false);
      setEditCustomerId(null);
    }
  };
  
  // Handle delete customer
  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      const success = deleteCustomer(id);
      if (success) {
        setCustomers(customers.filter(c => c.id !== id));
      }
    }
  };
  
  // Load customer for editing
  const loadCustomerForEdit = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setNotes(customer.notes || '');
      setEditCustomerId(id);
      setIsEditDialogOpen(true);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
  };
  
  // View customer quotations
  const viewCustomerQuotations = (id: string) => {
    navigate(`/quotations?customerId=${id}`);
  };
  
  // Send email to customer
  const sendEmailToCustomer = async (customer: Customer) => {
    await sendWelcomeEmail(customer.email, customer.name);
  };
  
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-alu-primary hover:bg-alu-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter customer details to add them to the system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name">Name *</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email">Email *</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter customer email"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone">Phone</label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter customer phone"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="address">Address</label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter customer address"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="notes">Notes</label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>
                Add Customer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Search and filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Customers table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Quotations</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <span className="font-mono">{customer.id}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        {customer.notes && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{customer.notes}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-sm mt-1">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {customer.quotations?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          {customer.created}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => loadCustomerForEdit(customer.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => viewCustomerQuotations(customer.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Quotations
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => sendEmailToCustomer(customer)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name">Name *</label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-email">Email *</label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter customer email"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-phone">Phone</label>
              <Input
                id="edit-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter customer phone"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-address">Address</label>
              <Textarea
                id="edit-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter customer address"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-notes">Notes</label>
              <Textarea
                id="edit-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsEditDialogOpen(false);
              setEditCustomerId(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>
              Update Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
