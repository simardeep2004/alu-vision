
import { useState, useEffect } from 'react';
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Delhi NCR, India specific data
const quotationData = [
  { month: 'Jan', count: 15 },
  { month: 'Feb', count: 22 },
  { month: 'Mar', count: 19 },
  { month: 'Apr', count: 28 },
  { month: 'May', count: 35 },
  { month: 'Jun', count: 30 },
];

const inventoryData = [
  { name: 'Aluminum Profiles', count: 145 },
  { name: 'Glass Panels', count: 94 },
  { name: 'Accessories', count: 230 },
  { name: 'Hardware', count: 178 },
];

const productUseData = [
  { name: 'Profile A-101', value: 38 },
  { name: 'Profile B-202', value: 28 },
  { name: 'Clear Glass 8mm', value: 18 },
  { name: 'Tinted Glass 6mm', value: 12 },
  { name: 'Other', value: 4 },
];

const COLORS = ['#4682B4', '#5FB3CE', '#20B2AA', '#4CAF50', '#FFA500'];

const recentActivities = [
  { id: 1, type: 'Quotation', description: 'New quotation #1234 created for Sharma Enterprises, Delhi', time: '2 hours ago' },
  { id: 2, type: 'Inventory', description: 'Stock updated: Profile A-101 (+50) from Rajouri Garden warehouse', time: '4 hours ago' },
  { id: 3, type: 'System', description: 'New user Sameer Gupta registered from Gurgaon branch', time: '1 day ago' },
  { id: 4, type: 'Quotation', description: 'Quotation #1233 converted to invoice for Luxury Apartments, Noida', time: '1 day ago' },
  { id: 5, type: 'Inventory', description: 'Low stock alert: Clear Glass 10mm at Faridabad warehouse', time: '2 days ago' },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalQuotations: 0,
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0
  });
  
  const [chartView, setChartView] = useState<'bar' | 'line'>('bar');
  const [activities, setActivities] = useState(recentActivities);
  const [chartData, setChartData] = useState(quotationData);
  
  // Initial data load and real-time subscription
  useEffect(() => {
    // Load initial data
    const fetchData = async () => {
      try {
        // Get quotations count from Supabase
        const { count: quotationsCount, error: quotationsError } = await supabase
          .from('quotations')
          .select('*', { count: 'exact', head: true });
          
        if (quotationsError) throw quotationsError;
        
        // Simulate other data
        setStats({
          totalQuotations: quotationsCount || 149,
          totalProducts: 647,
          totalValue: 9650000, // in INR
          lowStockItems: 8
        });
        
        // Get recent quotations
        const { data: recentQuotations, error: recentError } = await supabase
          .from('quotations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (recentError) throw recentError;
        
        if (recentQuotations && recentQuotations.length > 0) {
          const newActivities = recentQuotations.map((quote, index) => ({
            id: index + 1,
            type: 'Quotation',
            description: `New quotation #${quote.id.slice(0, 4)} created for ${quote.customer_name}, Delhi NCR`,
            time: getTimeAgo(new Date(quote.created_at))
          }));
          
          // Combine with existing activities
          setActivities([...newActivities, ...recentActivities.slice(newActivities.length)]);
        }
        
        // Get monthly quotation data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('quotations')
          .select('date')
          .gte('date', '2025-01-01')
          .lte('date', '2025-06-30');
          
        if (monthlyError) throw monthlyError;
        
        if (monthlyData && monthlyData.length > 0) {
          // Count quotations per month
          const monthlyCounts = months.map(month => {
            const monthIndex = months.indexOf(month);
            const count = monthlyData.filter(q => {
              const date = new Date(q.date);
              return date.getMonth() === monthIndex;
            }).length;
            
            // If no quotations for this month, use the sample data
            return { 
              month, 
              count: count || quotationData.find(d => d.month === month)?.count || 0 
            };
          });
          
          setChartData(monthlyCounts);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchData();
    
    // Subscribe to real-time updates
    const quotationsChannel = supabase
      .channel('public:quotations')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'quotations' 
      }, (payload) => {
        console.log('New quotation:', payload);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalQuotations: prev.totalQuotations + 1
        }));
        
        // Update activities
        const newQuotation = payload.new;
        const newActivity = {
          id: Math.random(),
          type: 'Quotation',
          description: `New quotation #${newQuotation.id.slice(0, 4)} created for ${newQuotation.customer_name}, Delhi NCR`,
          time: 'just now'
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
        
        // Notify user
        toast.success('New quotation created!', {
          description: `${newQuotation.customer_name} - ₹${(newQuotation.total).toLocaleString('en-IN')}`
        });
        
        // Update chart data
        const date = new Date(newQuotation.date);
        const monthName = new Date(date).toLocaleString('en-US', { month: 'short' });
        
        setChartData(prev => {
          const newData = [...prev];
          const monthIndex = newData.findIndex(d => d.month === monthName);
          
          if (monthIndex >= 0) {
            newData[monthIndex] = {
              ...newData[monthIndex],
              count: newData[monthIndex].count + 1
            };
          }
          
          return newData;
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(quotationsChannel);
    };
  }, []);
  
  // Helper function to format time ago
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'just now';
  };
  
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Delhi NCR Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Quotations</h3>
          <p className="text-3xl font-bold text-alu-primary">{stats.totalQuotations}</p>
          <span className="text-green-500 text-xs mt-2">↑ 12% from last month</span>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Products in Inventory</h3>
          <p className="text-3xl font-bold text-alu-primary">{stats.totalProducts}</p>
          <span className="text-xs mt-2">Across 4 categories</span>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Inventory Value</h3>
          <p className="text-3xl font-bold text-alu-primary">₹{(stats.totalValue/100000).toFixed(2)} Lakh</p>
          <span className="text-green-500 text-xs mt-2">↑ 8% from last quarter</span>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Low Stock Items</h3>
          <p className="text-3xl font-bold text-orange-500">{stats.lowStockItems}</p>
          <span className="text-orange-500 text-xs mt-2">Requires attention</span>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quotation Chart */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Delhi NCR Quotations</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartView('bar')}
                className={`p-1.5 rounded ${chartView === 'bar' ? 'bg-alu-primary text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <BarChart size={18} />
              </button>
              <button
                onClick={() => setChartView('line')}
                className={`p-1.5 rounded ${chartView === 'line' ? 'bg-alu-primary text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <LineChart size={18} />
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'bar' ? (
                <ReBarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} Quotations`, 'Count']} />
                  <Bar dataKey="count" fill="#4682B4" />
                </ReBarChart>
              ) : (
                <ReLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} Quotations`, 'Count']} />
                  <Line type="monotone" dataKey="count" stroke="#4682B4" activeDot={{ r: 8 }} />
                </ReLineChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Top Products Chart */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Top Products Used in NCR</h2>
            <PieChart size={18} className="text-gray-400" />
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={productUseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Projects`, 'Used In']} />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="p-6 hover:shadow-md transition-shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activities in Delhi NCR</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
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
        </Card>
        
        {/* Inventory Status */}
        <Card className="p-6 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4">Delhi NCR Inventory Status</h2>
          <div className="space-y-4">
            {inventoryData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.count} items</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-alu-primary h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (item.count / 200) * 100)}%`,
                      backgroundColor: COLORS[index % COLORS.length] 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
