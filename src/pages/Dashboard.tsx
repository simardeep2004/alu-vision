
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuotations: 0,
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0
  });
  
  const [chartView, setChartView] = useState<'bar' | 'line'>('bar');
  const [quotationData, setQuotationData] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  // Initial data load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get quotations count
        const { count: quotationsCount, error: quotationsError } = await supabase
          .from('quotations')
          .select('*', { count: 'exact', head: true });
          
        if (quotationsError) throw quotationsError;
        
        setStats({
          totalQuotations: quotationsCount || 0,
          totalProducts: 0,
          totalValue: 0,
          lowStockItems: 0
        });
        
        // Get recent activities (can be implemented with actual data later)
        setActivities([]);
        
        // Setup empty quotation data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const emptyData = months.map(month => ({
          month,
          count: 0
        }));
        
        setQuotationData(emptyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Quotations</h3>
          <p className="text-3xl font-bold text-alu-primary">{stats.totalQuotations}</p>
          <span className="text-xs mt-2">All time</span>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Products in Inventory</h3>
          <p className="text-3xl font-bold text-alu-primary">{stats.totalProducts}</p>
          <span className="text-xs mt-2">Across all categories</span>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Inventory Value</h3>
          <p className="text-3xl font-bold text-alu-primary">₹0</p>
          <span className="text-xs mt-2">Total value</span>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Low Stock Items</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.lowStockItems}</p>
          <span className="text-xs mt-2">Requires attention</span>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quotations</h2>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            {quotationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {chartView === 'bar' ? (
                  <BarChart data={quotationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} Quotations`, 'Count']} />
                    <Bar dataKey="count" fill="#4682B4" />
                  </BarChart>
                ) : (
                  <LineChart data={quotationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} Quotations`, 'Count']} />
                    <Line type="monotone" dataKey="count" stroke="#4682B4" activeDot={{ r: 8 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Summary</h2>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{activity.type}</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent activities</p>
          )}
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Inventory Status</h2>
          <p className="text-gray-500">No inventory data available</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
