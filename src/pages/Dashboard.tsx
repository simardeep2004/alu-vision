
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
  const [loading, setLoading] = useState(true);
  
  // Initial data load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get quotations count
        const { count: quotationsCount, error: quotationsError } = await supabase
          .from('quotations')
          .select('*', { count: 'exact', head: true });
          
        if (quotationsError) throw quotationsError;
        
        // Get products count
        const { count: productsCount, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
          
        if (productsError) throw productsError;
        
        // Get quotations for total value calculation
        const { data: quotationsData, error: quotationsDataError } = await supabase
          .from('quotations')
          .select('total');
          
        if (quotationsDataError) throw quotationsDataError;
        
        const totalValue = quotationsData?.reduce((sum, item) => sum + item.total, 0) || 0;
        
        setStats({
          totalQuotations: quotationsCount || 0,
          totalProducts: productsCount || 0,
          totalValue: totalValue,
          lowStockItems: 0
        });
        
        // Get recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activity_log')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(5);
          
        if (activitiesError) throw activitiesError;
        
        setActivities(activitiesData?.map(activity => ({
          type: 'Activity',
          description: activity.action,
          time: new Date(activity.timestamp).toLocaleString()
        })) || []);
        
        // Get quotation data for chart
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('quotations')
          .select('date, status');
          
        if (monthlyError) throw monthlyError;
        
        // Process data for chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        
        const monthCounts = months.map(month => ({
          month,
          count: 0
        }));
        
        monthlyData?.forEach(item => {
          const date = new Date(item.date);
          if (date.getFullYear() === currentYear) {
            const monthIndex = date.getMonth();
            monthCounts[monthIndex].count += 1;
          }
        });
        
        setQuotationData(monthCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time listeners
    const quotationsChannel = supabase
      .channel('quotations-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'quotations' 
      }, () => {
        fetchData();
      })
      .subscribe();
      
    const activitiesChannel = supabase
      .channel('activities-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activity_log' 
      }, () => {
        fetchData();
      })
      .subscribe();
      
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'products' 
      }, () => {
        fetchData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(quotationsChannel);
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);
  
  // Function to toggle chart view
  const toggleChartView = () => {
    setChartView(prev => prev === 'bar' ? 'line' : 'bar');
  };
  
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
          <p className="text-3xl font-bold text-alu-primary">₹{stats.totalValue.toFixed(2)}</p>
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
            <button 
              onClick={toggleChartView}
              className="text-sm text-alu-primary hover:underline"
            >
              Switch to {chartView === 'bar' ? 'Line' : 'Bar'} Chart
            </button>
          </div>
          
          <div className="h-80 flex items-center justify-center">
            {loading ? (
              <p className="text-gray-500">Loading chart data...</p>
            ) : quotationData.length > 0 ? (
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
            {loading ? (
              <p className="text-gray-500">Loading data...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Products', value: stats.totalProducts },
                      { name: 'Quotations', value: stats.totalQuotations }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#4682B4" />
                    <Cell fill="#82ca9d" />
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          {loading ? (
            <p className="text-gray-500">Loading activities...</p>
          ) : activities.length > 0 ? (
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
          {loading ? (
            <p className="text-gray-500">Loading inventory data...</p>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {['Aluminum Profiles', 'Glass Panels', 'Accessories', 'Hardware'].map(category => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{category}</span>
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 50)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/inventory" className="text-sm text-alu-primary hover:underline">View full inventory →</a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
