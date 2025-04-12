
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ChevronDown,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Types
type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
};

// Mock data
const inventoryData: InventoryItem[] = [
  {
    id: '001',
    name: 'Aluminum Profile A-101',
    category: 'Profiles',
    quantity: 150,
    unit: 'pcs',
    price: 45.99,
    status: 'In Stock',
    lastUpdated: '2023-10-15',
  },
  {
    id: '002',
    name: 'Clear Glass 6mm',
    category: 'Glass',
    quantity: 80,
    unit: 'sqm',
    price: 25.50,
    status: 'In Stock',
    lastUpdated: '2023-10-12',
  },
  {
    id: '003',
    name: 'Handle Type B',
    category: 'Accessories',
    quantity: 12,
    unit: 'pcs',
    price: 8.75,
    status: 'Low Stock',
    lastUpdated: '2023-10-10',
  },
  {
    id: '004',
    name: 'Sliding Mechanism SL-200',
    category: 'Hardware',
    quantity: 0,
    unit: 'sets',
    price: 65.00,
    status: 'Out of Stock',
    lastUpdated: '2023-09-30',
  },
  {
    id: '005',
    name: 'Tinted Glass 8mm',
    category: 'Glass',
    quantity: 45,
    unit: 'sqm',
    price: 35.75,
    status: 'In Stock',
    lastUpdated: '2023-10-14',
  },
  {
    id: '006',
    name: 'Corner Joint CJ-101',
    category: 'Accessories',
    quantity: 200,
    unit: 'pcs',
    price: 2.50,
    status: 'In Stock',
    lastUpdated: '2023-10-08',
  },
  {
    id: '007',
    name: 'Aluminum Profile B-202',
    category: 'Profiles',
    quantity: 8,
    unit: 'pcs',
    price: 52.25,
    status: 'Low Stock',
    lastUpdated: '2023-10-05',
  },
  {
    id: '008',
    name: 'Silicon Sealant',
    category: 'Consumables',
    quantity: 25,
    unit: 'tubes',
    price: 7.99,
    status: 'In Stock',
    lastUpdated: '2023-10-13',
  },
];

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>(inventoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Profiles',
    quantity: 0,
    unit: 'pcs',
    price: 0,
  });
  
  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = ['Profiles', 'Glass', 'Accessories', 'Hardware', 'Consumables'];
  const units = ['pcs', 'sqm', 'sets', 'tubes', 'meters', 'kg'];
  
  // Handle add item
  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: `00${items.length + 1}`,
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      price: formData.price,
      status: formData.quantity === 0 ? 'Out of Stock' : formData.quantity < 20 ? 'Low Stock' : 'In Stock',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Item added successfully');
  };
  
  // Handle edit item
  const handleEditItem = () => {
    if (!editItem) return;
    
    const updatedItems = items.map(item => {
      if (item.id === editItem.id) {
        return {
          ...item,
          name: formData.name,
          category: formData.category,
          quantity: formData.quantity,
          unit: formData.unit,
          price: formData.price,
          status: formData.quantity === 0 ? 'Out of Stock' : formData.quantity < 20 ? 'Low Stock' : 'In Stock',
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return item;
    });
    
    setItems(updatedItems);
    setIsEditDialogOpen(false);
    resetForm();
    toast.success('Item updated successfully');
  };
  
  // Handle delete item
  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    const updatedItems = items.filter(item => item.id !== itemToDelete);
    setItems(updatedItems);
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    toast.success('Item deleted successfully');
  };
  
  // Open edit dialog
  const openEditDialog = (item: InventoryItem) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
    });
    setIsEditDialogOpen(true);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Profiles',
      quantity: 0,
      unit: 'pcs',
      price: 0,
    });
    setEditItem(null);
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button 
          className="mt-4 md:mt-0 bg-alu-primary hover:bg-alu-primary/90"
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
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
      </div>
      
      {/* Inventory Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <AlertCircle size={24} className="mb-2" />
                      <p>No items found. Try adjusting your search or filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`
                          ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' : ''}
                          ${item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' : ''}
                        `}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                          onClick={() => {
                            setItemToDelete(item.id);
                            setIsDeleteDialogOpen(true);
                          }}
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
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Aluminum Profile A-101"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  min={0}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={!formData.name || formData.price <= 0}
              className="bg-alu-primary hover:bg-alu-primary/90"
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the item details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Item Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger id="edit-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  min={0}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (USD)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditItem}
              disabled={!formData.name || formData.price <= 0}
              className="bg-alu-primary hover:bg-alu-primary/90"
            >
              Update Item
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
              Are you sure you want to delete this item? This action cannot be undone.
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
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
