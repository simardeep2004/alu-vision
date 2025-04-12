
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Mail, 
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';

// Types
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
};

type QuotationItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
};

// Mock inventory data
const inventoryData: InventoryItem[] = [
  {
    id: '001',
    name: 'Aluminum Profile A-101',
    category: 'Profiles',
    quantity: 150,
    unit: 'pcs',
    price: 45.99,
  },
  {
    id: '002',
    name: 'Clear Glass 6mm',
    category: 'Glass',
    quantity: 80,
    unit: 'sqm',
    price: 25.50,
  },
  {
    id: '003',
    name: 'Handle Type B',
    category: 'Accessories',
    quantity: 12,
    unit: 'pcs',
    price: 8.75,
  },
  {
    id: '004',
    name: 'Sliding Mechanism SL-200',
    category: 'Hardware',
    quantity: 5,
    unit: 'sets',
    price: 65.00,
  },
  {
    id: '005',
    name: 'Tinted Glass 8mm',
    category: 'Glass',
    quantity: 45,
    unit: 'sqm',
    price: 35.75,
  },
  {
    id: '006',
    name: 'Corner Joint CJ-101',
    category: 'Accessories',
    quantity: 200,
    unit: 'pcs',
    price: 2.50,
  },
  {
    id: '007',
    name: 'Aluminum Profile B-202',
    category: 'Profiles',
    quantity: 8,
    unit: 'pcs',
    price: 52.25,
  },
  {
    id: '008',
    name: 'Silicon Sealant',
    category: 'Consumables',
    quantity: 25,
    unit: 'tubes',
    price: 7.99,
  },
];

const QuotationBuilder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<QuotationItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(inventoryData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  
  // Calculate total
  const total = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Update filtered items when search query or category changes
  useEffect(() => {
    const filtered = inventoryData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory]);
  
  // Handle add item
  const handleAddItem = () => {
    if (!selectedItemId || quantity <= 0) return;
    
    const item = inventoryData.find(item => item.id === selectedItemId);
    if (!item) return;
    
    // Check if item already exists in the quotation
    const existingItemIndex = selectedItems.findIndex(i => i.id === selectedItemId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...selectedItems];
      const existingItem = updatedItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice: newQuantity * existingItem.unitPrice,
      };
      
      setSelectedItems(updatedItems);
    } else {
      // Add new item
      const newItem: QuotationItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        quantity,
        unit: item.unit,
        unitPrice: item.price,
        totalPrice: quantity * item.price,
      };
      
      setSelectedItems([...selectedItems, newItem]);
    }
    
    // Reset form
    setSelectedItemId('');
    setQuantity(1);
    setShowAddItemDialog(false);
    
    toast.success('Item added to quotation');
  };
  
  // Handle remove item
  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
    toast.success('Item removed from quotation');
  };
  
  // Handle update item quantity
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const updatedItems = selectedItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.unitPrice,
        };
      }
      return item;
    });
    
    setSelectedItems(updatedItems);
  };
  
  // Handle save quotation
  const handleSaveQuotation = (status: 'Draft' | 'Sent') => {
    // Validate form
    if (!customerName) {
      toast.error('Please enter a customer name');
      return;
    }
    
    if (!customerEmail) {
      toast.error('Please enter a customer email');
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item to the quotation');
      return;
    }
    
    // In a real app, this would save to the database
    toast.success(`Quotation saved as ${status}`);
    navigate('/quotations');
  };
  
  // Get unique categories from inventory
  const categories = ['Profiles', 'Glass', 'Accessories', 'Hardware', 'Consumables'];
  
  return (
    <div className="page-container">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/quotations')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Quotation</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="glass-card lg:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or specifications"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quotation Items */}
        <Card className="glass-card lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Quotation Items</h2>
              <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-alu-primary hover:bg-alu-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Item to Quotation</DialogTitle>
                    <DialogDescription>
                      Search and select items from your inventory
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    {/* Search and Filter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Items List */}
                    <div className="border rounded-md max-h-[200px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                No items found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredItems.map((item) => (
                              <TableRow key={item.id} className={selectedItemId === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                                <TableCell>
                                  <input
                                    type="radio"
                                    name="selectedItem"
                                    checked={selectedItemId === item.id}
                                    onChange={() => setSelectedItemId(item.id)}
                                    className="h-4 w-4 text-alu-primary focus:ring-alu-primary"
                                  />
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Quantity */}
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        disabled={!selectedItemId}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedItemId('');
                        setQuantity(1);
                        setShowAddItemDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddItem}
                      disabled={!selectedItemId || quantity <= 0}
                      className="bg-alu-primary hover:bg-alu-primary/90"
                    >
                      Add to Quotation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Items Table */}
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No items added to quotation yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <span className="ml-1 text-sm text-gray-500">{item.unit}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  
                  {/* Summary Row */}
                  {selectedItems.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg text-alu-primary">
                        ${total.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        <Button
          variant="outline"
          onClick={() => navigate('/quotations')}
        >
          Cancel
        </Button>
        
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-alu-primary hover:bg-alu-primary/90">
              <Save className="h-4 w-4 mr-2" />
              Save Quotation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Quotation</DialogTitle>
              <DialogDescription>
                Choose how you want to save this quotation
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 text-left p-4"
                onClick={() => handleSaveQuotation('Draft')}
              >
                <Save className="h-8 w-8 mb-2" />
                <div>
                  <div className="font-medium">Save as Draft</div>
                  <div className="text-sm text-gray-500">Edit later</div>
                </div>
              </Button>
              
              <Button
                className="flex flex-col items-center justify-center h-24 text-left p-4 bg-alu-primary hover:bg-alu-primary/90"
                onClick={() => handleSaveQuotation('Sent')}
              >
                <Mail className="h-8 w-8 mb-2" />
                <div>
                  <div className="font-medium">Save & Email</div>
                  <div className="text-sm">Send to customer</div>
                </div>
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => {
                  toast.success('Quotation is ready to print');
                  setIsSaveDialogOpen(false);
                }}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center"
                onClick={() => {
                  toast.success('Quotation downloaded as PDF');
                  setIsSaveDialogOpen(false);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuotationBuilder;
