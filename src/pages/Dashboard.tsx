
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

// Mock data
const quotationData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 19 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 24 },
  { month: 'May', count: 30 },
  { month: 'Jun', count: 22 },
];

const inventoryData = [
  { name: 'Aluminum Profiles', count: 120 },
  { name: 'Glass Panels', count: 80 },
  { name: 'Accessories', count: 200 },
  { name: 'Hardware', count: 150 },
];

const productUseData = [
  { name: 'Profile A-101', value: 35 },
  { name: 'Profile B-202', value: 25 },
  { name: 'Clear Glass 8mm', value: 20 },
  { name: 'Tinted Glass 6mm', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#4682B4', '#5FB3CE', '#20B2AA', '#4CAF50', '#FFA500'];

const recentActivities = [
  { id: 1, type: 'Quotation', description: 'New quotation #1234 created', time: '2 hours ago' },
  { id: 2, type: 'Inventory', description: 'Stock updated: Profile A-101 (+50)', time: '4 hours ago' },
  { id: 3, type: 'System', description: 'New user Samantha Brown registered', time: '1 day ago' },
  { id: 4, type: 'Quotation', description: 'Quotation #1233 converted to invoice', time: '1 day ago' },
  { id: 5, type: 'Inventory', description: 'Low stock alert: Clear Glass 10mm', time: '2 days ago' },
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
    // In a real app, this would be an API call
    setTimeout(() => {
      setStats({
        totalQuotations: 122,
        totalProducts: 550,
        totalValue: 78500,
        lowStockItems: 5
      });
    }, 1000);
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
          <p className="text-3xl font-bold text-alu-primary">${stats.totalValue.toLocaleString()}</p>
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
            <h2 className="text-lg font-semibold">Quotations Overview</h2>
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
            <h2 className="text-lg font-semibold">Top Products Used</h2>
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
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
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
          <h2 className="text-lg font-semibold mb-4">Inventory Status</h2>
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
