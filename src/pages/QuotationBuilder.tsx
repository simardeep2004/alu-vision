
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Mail, 
  Download,
  Printer,
  Percent,
  Calculator,
  Info
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Types
type ItemCategory = 'Shutter' | 'OuterFrame' | 'Glass' | 'Accessory' | 'Hardware' | 'Other';

interface BaseItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
}

interface ShutterItem extends BaseItem {
  category: 'Shutter';
  material: string;
  thickness: number;
  color: string;
}

interface FrameItem extends BaseItem {
  category: 'OuterFrame';
  style: string;
  material: string;
  color: string;
}

interface GlassItem extends BaseItem {
  category: 'Glass';
  type: string;
  thickness: number;
  treatment?: string;
}

interface AccessoryItem extends BaseItem {
  category: 'Accessory';
  type: string;
}

interface HardwareItem extends BaseItem {
  category: 'Hardware';
  type: string;
}

interface OtherItem extends BaseItem {
  category: 'Other';
  type: string;
}

type InventoryItem = ShutterItem | FrameItem | GlassItem | AccessoryItem | HardwareItem | OtherItem;

type QuotationItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
};

type QuotationSeries = 'standard' | 'premium' | 'luxury';

// Mock inventory data
const inventoryData: InventoryItem[] = [
  {
    id: '001',
    name: 'Aluminum Casement Shutter',
    category: 'Shutter',
    material: 'Aluminum',
    thickness: 1.2,
    color: 'White',
    description: 'Standard casement window shutter',
    price: 1800.00,
  },
  {
    id: '002',
    name: 'Premium Sliding Shutter',
    category: 'Shutter',
    material: 'Aluminum',
    thickness: 1.4,
    color: 'Silver',
    description: 'Premium sliding window shutter',
    price: 2400.00,
  },
  {
    id: '003',
    name: 'Standard Outer Frame',
    category: 'OuterFrame',
    style: 'Simple',
    material: 'Aluminum',
    color: 'White',
    description: 'Standard window outer frame',
    price: 1200.00,
  },
  {
    id: '004',
    name: 'Deluxe Outer Frame',
    category: 'OuterFrame',
    style: 'Decorative',
    material: 'Aluminum',
    color: 'Brown',
    description: 'Decorative window outer frame',
    price: 1800.00,
  },
  {
    id: '005',
    name: 'Clear Glass 5mm',
    category: 'Glass',
    type: 'Clear',
    thickness: 5,
    description: 'Standard clear glass',
    price: 550.00,
  },
  {
    id: '006',
    name: 'Clear Glass 6mm',
    category: 'Glass',
    type: 'Clear',
    thickness: 6,
    description: 'Thicker clear glass',
    price: 650.00,
  },
  {
    id: '007',
    name: 'Tinted Glass 5mm',
    category: 'Glass',
    type: 'Tinted',
    thickness: 5,
    description: 'Standard tinted glass',
    price: 750.00,
  },
  {
    id: '008',
    name: 'Tinted Glass 6mm',
    category: 'Glass',
    type: 'Tinted',
    thickness: 6,
    description: 'Thicker tinted glass',
    price: 850.00,
  },
  {
    id: '009',
    name: 'Frosted Glass 5mm',
    category: 'Glass',
    type: 'Frosted',
    thickness: 5,
    description: 'Privacy frosted glass',
    price: 850.00,
  },
  {
    id: '010',
    name: 'Frosted Glass 6mm',
    category: 'Glass',
    type: 'Frosted',
    thickness: 6,
    description: 'Thicker privacy frosted glass',
    price: 950.00,
  },
  {
    id: '011',
    name: 'Basic Handle',
    category: 'Accessory',
    type: 'Handle',
    description: 'Standard window handle',
    price: 250.00,
  },
  {
    id: '012',
    name: 'Deluxe Handle',
    category: 'Accessory',
    type: 'Handle',
    description: 'Premium finish window handle',
    price: 450.00,
  },
  {
    id: '013',
    name: 'Standard Lock',
    category: 'Accessory',
    type: 'Lock',
    description: 'Basic window lock mechanism',
    price: 350.00,
  },
  {
    id: '014',
    name: 'Security Lock',
    category: 'Accessory',
    type: 'Lock',
    description: 'Enhanced security window lock',
    price: 650.00,
  },
  {
    id: '015',
    name: 'Standard Hinges (Pair)',
    category: 'Hardware',
    type: 'Hinge',
    description: 'Standard window hinges',
    price: 300.00,
  },
  {
    id: '016',
    name: 'Heavy Duty Hinges (Pair)',
    category: 'Hardware',
    type: 'Hinge',
    description: 'Reinforced window hinges',
    price: 500.00,
  },
  {
    id: '017',
    name: 'Sliding Mechanism',
    category: 'Hardware',
    type: 'Slider',
    description: 'Smooth sliding window mechanism',
    price: 800.00,
  },
  {
    id: '018',
    name: 'Weather Strip',
    category: 'Accessory',
    type: 'Sealant',
    description: 'Weather-proof sealing strip',
    price: 200.00,
  },
  {
    id: '019',
    name: 'Standard Installation',
    category: 'Other',
    type: 'Service',
    description: 'Basic installation service',
    price: 1500.00,
  },
  {
    id: '020',
    name: 'Premium Installation',
    category: 'Other',
    type: 'Service',
    description: 'Comprehensive installation with warranty',
    price: 2500.00,
  },
];

const QuotationBuilder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<QuotationItem[]>([]);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(inventoryData);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<QuotationSeries>('standard');
  const [wastagePercent, setWastagePercent] = useState<number>(5);
  const [taxPercent, setTaxPercent] = useState<number>(18); // GST
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  
  // Pricing multipliers based on series
  const seriesMultipliers = {
    'standard': 1.0,
    'premium': 1.2,
    'luxury': 1.5
  };
  
  // Category specific pricing multipliers
  const categoryMultipliers = {
    'Shutter': 1.0,
    'OuterFrame': 1.0,
    'Glass': 1.0,
    'Accessory': 1.0,
    'Hardware': 1.0,
    'Other': 1.0
  };
  
  // Calculate total
  const subtotal = selectedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const wastageAmount = (subtotal * (wastagePercent / 100));
  const discountAmount = ((subtotal + wastageAmount) * (discountPercent / 100));
  const taxableAmount = subtotal + wastageAmount - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const total = taxableAmount + taxAmount;
  
  // Get series multiplier
  const getSeriesMultiplier = () => {
    return seriesMultipliers[selectedSeries];
  };
  
  // Calculate item price with series adjustment
  const calculateAdjustedPrice = (item: InventoryItem) => {
    const seriesMultiplier = getSeriesMultiplier();
    const categoryMultiplier = categoryMultipliers[item.category as keyof typeof categoryMultipliers];
    return item.price * seriesMultiplier * categoryMultiplier;
  };
  
  // Update filtered items when search query or category changes
  useEffect(() => {
    const filtered = inventoryData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
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
    
    const adjustedPrice = calculateAdjustedPrice(item);
    
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
        description: item.description,
        quantity,
        unitPrice: adjustedPrice,
        totalPrice: quantity * adjustedPrice,
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
  
  // Handle change series - update all pricing
  const handleChangeSeries = (newSeries: QuotationSeries) => {
    setSelectedSeries(newSeries);
    
    // Update all item prices based on the new series
    const updatedItems = selectedItems.map(item => {
      const inventoryItem = inventoryData.find(invItem => invItem.id === item.id);
      if (inventoryItem) {
        const newUnitPrice = calculateAdjustedPrice(inventoryItem);
        return {
          ...item,
          unitPrice: newUnitPrice,
          totalPrice: item.quantity * newUnitPrice,
        };
      }
      return item;
    });
    
    setSelectedItems(updatedItems);
    toast.success(`Changed to ${newSeries.charAt(0).toUpperCase() + newSeries.slice(1)} series pricing`);
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
  const categories = Array.from(new Set(inventoryData.map(item => item.category)));
  
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
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Customer Information */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Information */}
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-alu-primary text-white inline-flex items-center justify-center mr-2">1</span>
                Customer Information
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name *</Label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="focus:border-alu-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Customer Email *</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="focus:border-alu-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone Number</Label>
                  <Input
                    id="customer-phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="focus:border-alu-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Textarea
                    id="customer-address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Enter customer address"
                    className="min-h-[80px] focus:border-alu-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Series Selection & Pricing */}
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-alu-primary text-white inline-flex items-center justify-center mr-2">2</span>
                Series & Pricing
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="series">Series Selection</Label>
                  <Tabs 
                    defaultValue={selectedSeries} 
                    className="w-full"
                    onValueChange={(value) => handleChangeSeries(value as QuotationSeries)}
                  >
                    <TabsList className="grid grid-cols-3 mb-2">
                      <TabsTrigger value="standard">Standard</TabsTrigger>
                      <TabsTrigger value="premium">Premium</TabsTrigger>
                      <TabsTrigger value="luxury">Luxury</TabsTrigger>
                    </TabsList>
                    
                    <div className="text-sm text-gray-500 mt-2">
                      {selectedSeries === 'standard' && (
                        <p>Basic features with standard materials and finishes.</p>
                      )}
                      {selectedSeries === 'premium' && (
                        <p>Enhanced quality with better materials and finishes.</p>
                      )}
                      {selectedSeries === 'luxury' && (
                        <p>High-end products with premium materials and finishes.</p>
                      )}
                    </div>
                  </Tabs>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="wastage" className="flex items-center gap-1">
                      Wastage Percentage
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={14} className="text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Estimated material wastage during manufacturing and installation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="wastage"
                        type="number"
                        value={wastagePercent}
                        onChange={(e) => setWastagePercent(Number(e.target.value))}
                        min={0}
                        max={20}
                        className="w-20 text-right"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="discount" className="flex items-center gap-1">
                      Discount
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={14} className="text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Discount percentage applied to the subtotal</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="discount"
                        type="number"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        min={0}
                        max={50}
                        className="w-20 text-right"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="tax" className="flex items-center gap-1">
                      Tax (GST)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={14} className="text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Tax percentage applied to the total after wastage and discount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex items-center">
                      <Input
                        id="tax"
                        type="number"
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(Number(e.target.value))}
                        min={0}
                        max={28}
                        className="w-20 text-right"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notes */}
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-alu-primary text-white inline-flex items-center justify-center mr-2">3</span>
                Additional Notes
              </h2>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or specifications"
                  className="min-h-[120px] focus:border-alu-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Quotation Items */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="glass-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <span className="w-8 h-8 rounded-full bg-alu-primary text-white inline-flex items-center justify-center mr-2">4</span>
                  Quotation Items
                </h2>
                <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-alu-primary hover:bg-alu-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add Item to Quotation</DialogTitle>
                      <DialogDescription>
                        Search and select items from the inventory
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      {/* Search and Filter */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        
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
                      <div className="border rounded-md max-h-[300px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredItems.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                  No items found
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredItems.map((item) => (
                                <TableRow 
                                  key={item.id} 
                                  className={selectedItemId === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                                  onClick={() => setSelectedItemId(item.id)}
                                >
                                  <TableCell>
                                    <input
                                      type="radio"
                                      name="selectedItem"
                                      checked={selectedItemId === item.id}
                                      onChange={() => setSelectedItemId(item.id)}
                                      className="h-4 w-4 text-alu-primary focus:ring-alu-primary"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500">{item.description}</div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">{item.category}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    {item.category === 'Shutter' && (
                                      <span className="text-sm">{item.material}, {item.thickness}mm, {item.color}</span>
                                    )}
                                    {item.category === 'OuterFrame' && (
                                      <span className="text-sm">{item.style}, {item.material}, {item.color}</span>
                                    )}
                                    {item.category === 'Glass' && (
                                      <span className="text-sm">{item.type}, {item.thickness}mm</span>
                                    )}
                                    {(item.category === 'Accessory' || item.category === 'Hardware' || item.category === 'Other') && (
                                      <span className="text-sm">{item.type}</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div>₹{calculateAdjustedPrice(item).toFixed(2)}</div>
                                    {getSeriesMultiplier() !== 1 && (
                                      <div className="text-xs text-gray-500">
                                        <span className="line-through">₹{item.price.toFixed(2)}</span>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* Quantity */}
                      <div className="grid gap-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="h-8 w-8 rounded-r-none"
                          >
                            -
                          </Button>
                          <Input
                            id="quantity"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            disabled={!selectedItemId}
                            className="rounded-none text-center h-8 min-w-0 w-20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={!selectedItemId}
                            className="h-8 w-8 rounded-l-none"
                          >
                            +
                          </Button>
                        </div>
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
              
              {/* Series Badge */}
              <div className="mb-4">
                <Badge className="bg-alu-accent text-white text-sm font-medium px-3 py-1">
                  {selectedSeries.charAt(0).toUpperCase() + selectedSeries.slice(1)} Series
                </Badge>
              </div>
              
              {/* Items Table */}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center">
                            <Calculator size={32} className="mb-2 text-gray-400" />
                            <p>No items added to quotation yet</p>
                            <p className="text-sm mt-1">Click the "Add Item" button to start building your quote</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.category}</div>
                              {item.description && (
                                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">₹{item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">₹{item.totalPrice.toFixed(2)}</TableCell>
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
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Pricing Summary */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center">
                        Wastage ({wastagePercent}%):
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={14} className="ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Estimated material wastage during manufacturing and installation</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                      <span>₹{wastageAmount.toFixed(2)}</span>
                    </div>
                    
                    {discountPercent > 0 && (
                      <div className="flex justify-between py-2 text-alu-accent">
                        <span className="flex items-center">
                          Discount ({discountPercent}%):
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info size={14} className="ml-1 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Discount applied to subtotal + wastage</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Taxable Amount:</span>
                      <span>₹{taxableAmount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Tax (GST {taxPercent}%):</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between py-2 font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-alu-primary">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
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
      </div>
    </div>
  );
};

export default QuotationBuilder;
