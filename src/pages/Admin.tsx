
import { useState, useEffect } from 'react';
import { 
  Users, 
  GanttChart, 
  BarChart3, 
  Settings, 
  Shield, 
  Clock, 
  UserPlus, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
};

type ActivityLog = {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
};

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@aluvision.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-10-15 09:30',
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@aluvision.com',
    role: 'user',
    status: 'active',
    lastLogin: '2023-10-14 15:45',
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2023-10-13 11:20',
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2023-09-28 14:15',
  },
  {
    id: '5',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2023-10-12 10:05',
  },
];

const activityLogs: ActivityLog[] = [
  {
    id: '1',
    user: 'Admin User',
    action: 'User Created',
    timestamp: '2023-10-15 10:15',
    details: 'Created new user: Jane Smith',
  },
  {
    id: '2',
    user: 'Test User',
    action: 'Login',
    timestamp: '2023-10-14 15:45',
    details: 'User logged in successfully',
  },
  {
    id: '3',
    user: 'John Doe',
    action: 'Quotation Created',
    timestamp: '2023-10-13 11:30',
    details: 'Created quotation #Q-2023-004',
  },
  {
    id: '4',
    user: 'Admin User',
    action: 'Inventory Updated',
    timestamp: '2023-10-13 09:45',
    details: 'Added 50 units of Aluminum Profile A-101',
  },
  {
    id: '5',
    user: 'Jane Smith',
    action: 'Password Reset',
    timestamp: '2023-10-12 14:20',
    details: 'User requested password reset',
  },
  {
    id: '6',
    user: 'Admin User',
    action: 'System Settings',
    timestamp: '2023-10-12 11:10',
    details: 'Updated email notification settings',
  },
  {
    id: '7',
    user: 'Robert Johnson',
    action: 'Login',
    timestamp: '2023-10-12 10:05',
    details: 'User logged in successfully',
  },
  {
    id: '8',
    user: 'Test User',
    action: 'Quotation Updated',
    timestamp: '2023-10-11 16:30',
    details: 'Modified quotation #Q-2023-002',
  },
];

// Mock chart data
const userActivityData = [
  { date: '10/10', logins: 5, quotations: 3, inventory: 2 },
  { date: '10/11', logins: 7, quotations: 4, inventory: 1 },
  { date: '10/12', logins: 4, quotations: 2, inventory: 3 },
  { date: '10/13', logins: 6, quotations: 5, inventory: 4 },
  { date: '10/14', logins: 8, quotations: 6, inventory: 3 },
  { date: '10/15', logins: 10, quotations: 8, inventory: 5 },
  { date: '10/16', logins: 9, quotations: 7, inventory: 6 },
];

const quotationStatusData = [
  { name: 'Draft', value: 8 },
  { name: 'Sent', value: 12 },
  { name: 'Approved', value: 15 },
  { name: 'Rejected', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [logs, setLogs] = useState<ActivityLog[]>(activityLogs);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Form state for add/edit user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    password: '',
  });
  
  // Check if current user is admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('You do not have permission to access the admin panel');
      // In a real app, you'd redirect to the dashboard
    }
  }, [user]);
  
  // Handle add user
  const handleAddUser = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Check if email already exists
    if (users.some(u => u.email === formData.email)) {
      toast.error('A user with this email already exists');
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: `${users.length + 1}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as 'admin' | 'user',
      status: formData.status as 'active' | 'inactive',
      lastLogin: 'Never',
    };
    
    setUsers([...users, newUser]);
    setIsAddUserDialogOpen(false);
    resetForm();
    toast.success('User added successfully');
    
    // Add to activity logs
    addActivityLog('Admin User', 'User Created', `Created new user: ${formData.name}`);
  };
  
  // Handle edit user
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // Validate form
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Check if email already exists (excluding this user)
    if (users.some(u => u.email === formData.email && u.id !== selectedUser.id)) {
      toast.error('A user with this email already exists');
      return;
    }
    
    // Update user
    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          name: formData.name,
          email: formData.email,
          role: formData.role as 'admin' | 'user',
          status: formData.status as 'active' | 'inactive',
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    resetForm();
    toast.success('User updated successfully');
    
    // Add to activity logs
    addActivityLog('Admin User', 'User Updated', `Updated user: ${formData.name}`);
  };
  
  // Handle delete user
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    // Check if trying to delete current admin
    const userToBeDeleted = users.find(u => u.id === userToDelete);
    if (userToBeDeleted?.email === 'admin@aluvision.com') {
      toast.error('Cannot delete the main admin account');
      setIsDeleteUserDialogOpen(false);
      setUserToDelete(null);
      return;
    }
    
    const updatedUsers = users.filter(u => u.id !== userToDelete);
    setUsers(updatedUsers);
    setIsDeleteUserDialogOpen(false);
    
    // Add to activity logs
    const deletedUser = users.find(u => u.id === userToDelete);
    if (deletedUser) {
      addActivityLog('Admin User', 'User Deleted', `Deleted user: ${deletedUser.name}`);
    }
    
    toast.success('User deleted successfully');
  };
  
  // Add activity log
  const addActivityLog = (user: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `${logs.length + 1}`,
      user,
      action,
      timestamp: new Date().toLocaleString(),
      details,
    };
    
    setLogs([newLog, ...logs]);
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      password: '',
    });
    setSelectedUser(null);
  };
  
  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <GanttChart className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        {/* User Management Tab */}
        <TabsContent value="users">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Button 
              className="bg-alu-primary hover:bg-alu-primary/90"
              onClick={() => {
                resetForm();
                setIsAddUserDialogOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role === 'admin' ? (
                            <div className="flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </div>
                          ) : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                status: user.status,
                                password: '',
                              });
                              setIsEditUserDialogOpen(true);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => {
                              setUserToDelete(user.id);
                              setIsDeleteUserDialogOpen(true);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Logs Tab */}
        <TabsContent value="activity">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Activity Logs</h2>
            <div className="w-72">
              <Input placeholder="Search logs..." />
            </div>
          </div>
          
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">System Reports</h2>
            <p className="text-gray-500">View system statistics and analytics</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* User Activity Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Last 7 days of system activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="logins" 
                        stroke="#4682B4" 
                        name="Logins" 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quotations" 
                        stroke="#20B2AA" 
                        name="Quotations" 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="inventory" 
                        stroke="#FFA500" 
                        name="Inventory Updates" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Quotation Status Chart */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quotation Status</CardTitle>
                <CardDescription>Distribution of quotation statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={quotationStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {quotationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Summary</CardTitle>
              <CardDescription>Key metrics and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="stats-card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{users.length}</p>
                  <span className="text-blue-600 dark:text-blue-300 text-xs mt-2">↑ 2 new this week</span>
                </div>
                
                <div className="stats-card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Quotations</h3>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-400">40</p>
                  <span className="text-green-600 dark:text-green-300 text-xs mt-2">↑ 8 new this week</span>
                </div>
                
                <div className="stats-card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Inventory Items</h3>
                  <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">128</p>
                  <span className="text-yellow-600 dark:text-yellow-300 text-xs mt-2">↑ 12 updated this week</span>
                </div>
                
                <div className="stats-card bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <h3 className="text-gray-500 text-sm font-medium mb-1">System Uptime</h3>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">99.9%</p>
                  <span className="text-purple-600 dark:text-purple-300 text-xs mt-2">Last 30 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddUserDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              className="bg-alu-primary hover:bg-alu-primary/90"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Password (leave blank to keep unchanged)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                  disabled={selectedUser?.email === 'admin@aluvision.com'}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={selectedUser?.email === 'admin@aluvision.com'}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditUserDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              className="bg-alu-primary hover:bg-alu-primary/90"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
