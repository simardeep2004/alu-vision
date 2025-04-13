
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

// Mock data for Delhi NCR, India
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
  
  // Simulate loading data
  useEffect(() => {
    // In a real app, this would be an API call to Supabase
    setTimeout(() => {
      setStats({
        totalQuotations: 149,
        totalProducts: 647,
        totalValue: 9650000, // in INR
        lowStockItems: 8
      });
    }, 1000);
    
    // Attempt to subscribe to real-time updates
    const channel = supabase
      .channel('public:quotations')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'quotations' 
      }, (payload) => {
        console.log('New quotation:', payload);
        // Update stats in real-time
        setStats(prev => ({
          ...prev,
          totalQuotations: prev.totalQuotations + 1
        }));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Quotations</h3>
          <p className="text-3xl font-bold text-alu-primary">{stats.totalQuotations}</p>
          <span className="text-green-500 text-xs mt-2">↑ 12% from last month</span>
        </div>
        
        <div className="stats-card">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Products in Inventory</h3>
          <p className="text-3xl font-bold text-alu-primary">{stats.totalProducts}</p>
          <span className="text-xs mt-2">Across 4 categories</span>
        </div>
        
        <div className="stats-card">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Inventory Value</h3>
          <p className="text-3xl font-bold text-alu-primary">₹{(stats.totalValue/100000).toFixed(2)} Lakh</p>
          <span className="text-green-500 text-xs mt-2">↑ 8% from last quarter</span>
        </div>
        
        <div className="stats-card">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Low Stock Items</h3>
          <p className="text-3xl font-bold text-alu-warning">{stats.lowStockItems}</p>
          <span className="text-orange-500 text-xs mt-2">Requires attention</span>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quotation Chart */}
        <Card className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Delhi NCR Quotations</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartView('bar')}
                className={`p-1 rounded ${chartView === 'bar' ? 'bg-alu-primary text-white' : 'text-gray-400'}`}
              >
                <BarChart size={18} />
              </button>
              <button
                onClick={() => setChartView('line')}
                className={`p-1 rounded ${chartView === 'line' ? 'bg-alu-primary text-white' : 'text-gray-400'}`}
              >
                <LineChart size={18} />
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'bar' ? (
                <ReBarChart data={quotationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4682B4" />
                </ReBarChart>
              ) : (
                <ReLineChart data={quotationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#4682B4" activeDot={{ r: 8 }} />
                </ReLineChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Top Products Chart */}
        <Card className="glass-card p-6">
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
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Activities in Delhi NCR</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
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
        <Card className="glass-card p-6">
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
