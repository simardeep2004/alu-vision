import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Save, Trash2, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Quotation, QuotationItem, QuotationStatus } from '@/types/quotation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const QuotationBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quotation, setQuotation] = useState<Omit<Quotation, 'id'>>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    date: new Date().toISOString().split('T')[0],
    total: 0,
    status: 'Draft',
    items: [],
    notes: ''
  });
  
  const [currentItem, setCurrentItem] = useState<Omit<QuotationItem, 'id' | 'totalPrice'>>({
    name: '',
    category: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    description: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const addItem = () => {
    if (!currentItem.name || !currentItem.category) {
      toast.error('Please provide item name and category');
      return;
    }
    
    const totalPrice = currentItem.quantity * currentItem.unitPrice;
    
    const newItem: QuotationItem = {
      id: uuidv4(),
      ...currentItem,
      totalPrice
    };
    
    setQuotation(prev => {
      const newItems = [...prev.items, newItem];
      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...prev,
        items: newItems,
        total: newTotal
      };
    });
    
    // Reset current item
    setCurrentItem({
      name: '',
      category: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      description: ''
    });
    
    toast.success('Item added to quotation');
  };
  
  const removeItem = (id: string) => {
    setQuotation(prev => {
      const newItems = prev.items.filter(item => item.id !== id);
      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      
      return {
        ...prev,
        items: newItems,
        total: newTotal
      };
    });
    
    toast.success('Item removed from quotation');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuotation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    if (field === 'status') {
      setQuotation(prev => ({
        ...prev,
        status: value as QuotationStatus
      }));
    } else if (field === 'unit' || field === 'category') {
      setCurrentItem(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  const saveQuotation = async (status: QuotationStatus = 'Draft') => {
    if (!quotation.customerName || !quotation.customerEmail) {
      toast.error('Customer name and email are required');
      return;
    }
    
    if (quotation.items.length === 0) {
      toast.error('Add at least one item to the quotation');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newQuotation: Quotation = {
        id: uuidv4(),
        ...quotation,
        status
      };
      
      // Save to Supabase
      const { error } = await supabase
        .from('quotations')
        .insert({
          id: newQuotation.id,
          customer_name: newQuotation.customerName,
          customer_email: newQuotation.customerEmail,
          customer_phone: newQuotation.customerPhone,
          customer_address: newQuotation.customerAddress,
          date: newQuotation.date,
          total: newQuotation.total,
          status: newQuotation.status,
          items: newQuotation.items,
          notes: newQuotation.notes
        });
      
      if (error) throw error;
      
      toast.success(`Quotation ${status === 'Sent' ? 'sent' : 'saved'} successfully`);
      navigate('/quotations');
    } catch (error) {
      console.error('Error saving quotation:', error);
      toast.error('Failed to save quotation');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Quotation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Name</Label>
              <Input 
                id="customerName" 
                name="customerName" 
                value={quotation.customerName} 
                onChange={handleInputChange} 
                placeholder="Customer name"
              />
            </div>
            
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input 
                id="customerEmail" 
                name="customerEmail" 
                type="email" 
                value={quotation.customerEmail} 
                onChange={handleInputChange} 
                placeholder="customer@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input 
                id="customerPhone" 
                name="customerPhone" 
                value={quotation.customerPhone || ''} 
                onChange={handleInputChange} 
                placeholder="Phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea 
                id="customerAddress" 
                name="customerAddress" 
                value={quotation.customerAddress || ''} 
                onChange={handleInputChange} 
                placeholder="Customer address"
                className="min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={quotation.date} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={quotation.notes || ''} 
                onChange={handleInputChange} 
                placeholder="Additional notes"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </Card>
        
        {/* Quotation Items */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Quotation Items</h2>
          
          {/* Add new item form */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-6">
            <h3 className="text-md font-medium mb-3">Add New Item</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={currentItem.name} 
                  onChange={handleItemChange} 
                  placeholder="Product name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={currentItem.category} 
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aluminum Profiles">Aluminum Profiles</SelectItem>
                    <SelectItem value="Glass Panels">Glass Panels</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  min="1" 
                  value={currentItem.quantity} 
                  onChange={handleItemChange}
                />
              </div>
              
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={currentItem.unit} 
                  onValueChange={(value) => handleSelectChange(value, 'unit')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="set">set</SelectItem>
                    <SelectItem value="meter">meter</SelectItem>
                    <SelectItem value="sqm">sqm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                <Input 
                  id="unitPrice" 
                  name="unitPrice" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={currentItem.unitPrice} 
                  onChange={handleItemChange}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={currentItem.description || ''} 
                  onChange={handleItemChange} 
                  placeholder="Optional description"
                />
              </div>
            </div>
            
            <Button onClick={addItem} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          {/* Items list */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">Items ({quotation.items.length})</h3>
            
            {quotation.items.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-gray-500">No items added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotation.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500">{item.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">{item.category}</td>
                        <td className="px-4 py-3 text-right">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-3 text-right">₹{item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-medium">₹{item.totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800 font-semibold">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right">Total:</td>
                      <td className="px-4 py-3 text-right">₹{quotation.total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button 
              variant="outline" 
              onClick={() => saveQuotation('Draft')} 
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            
            <Button 
              onClick={() => saveQuotation('Sent')} 
              disabled={isSaving}
              className="bg-alu-primary hover:bg-alu-primary/90"
            >
              <Send className="mr-2 h-4 w-4" />
              Save and Send
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuotationBuilder;
