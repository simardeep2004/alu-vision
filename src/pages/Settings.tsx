import { useState, useEffect } from 'react';
import { 
  User, 
  Languages, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Lock,
  CreditCard,
  Trash2,
  Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState('english');
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    stockAlerts: true,
    quotationAlerts: true,
    marketingEmails: false,
  });
  
  const handleSaveProfile = async () => {
    try {
      await updateProfile({ full_name: name });
      toast.success('Profile settings saved successfully');
    } catch (error) {
      toast.error('Failed to save profile settings');
    }
  };
  
  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved successfully');
  };
  
  const handleSaveNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          message: 'Notification settings updated',
          read: false
        });
      
      if (error) throw error;
      
      toast.success('Notification preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    }
  };
  
  return (
    <div className="page-container max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} /> Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sun size={16} /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield size={16} /> Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Your Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Linked Accounts</h3>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} className="text-gray-400" />
                    <span>Payment Methods</span>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="bg-alu-primary hover:bg-alu-primary/90"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Theme Preference</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition flex flex-col items-center gap-2 ${theme === 'light' ? 'border-alu-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => setTheme('light')}
                  >
                    <Sun size={24} className="text-alu-primary" />
                    <span>Light</span>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-alu-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => setTheme('dark')}
                  >
                    <Moon size={24} className="text-alu-primary" />
                    <span>Dark</span>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition flex flex-col items-center gap-2 ${theme === 'system' ? 'border-alu-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="flex">
                      <Sun size={24} className="text-alu-primary" />
                      <Moon size={24} className="text-alu-primary -ml-2" />
                    </div>
                    <span>System</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <Label htmlFor="density">Interface Density</Label>
                <Select defaultValue="regular">
                  <SelectTrigger id="density">
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="fontSize">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSaveAppearance}
                className="bg-alu-primary hover:bg-alu-primary/90"
              >
                <Save size={16} className="mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-alerts" className="flex-1">
                      Email Alerts
                      <p className="text-sm text-gray-500 font-normal">
                        Receive important alerts via email
                      </p>
                    </Label>
                    <Switch 
                      id="email-alerts" 
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailAlerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stock-alerts" className="flex-1">
                      Low Stock Alerts
                      <p className="text-sm text-gray-500 font-normal">
                        Get notified when inventory levels are low
                      </p>
                    </Label>
                    <Switch 
                      id="stock-alerts" 
                      checked={notifications.stockAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, stockAlerts: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quotation-alerts" className="flex-1">
                      Quotation Updates
                      <p className="text-sm text-gray-500 font-normal">
                        Notifications for new or updated quotations
                      </p>
                    </Label>
                    <Switch 
                      id="quotation-alerts" 
                      checked={notifications.quotationAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, quotationAlerts: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Marketing Communications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-emails" className="flex-1">
                    Marketing Emails
                    <p className="text-sm text-gray-500 font-normal">
                      Receive special offers and updates
                    </p>
                  </Label>
                  <Switch 
                    id="marketing-emails" 
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={handleSaveNotifications}
                className="bg-alu-primary hover:bg-alu-primary/90"
              >
                <Save size={16} className="mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Change Password</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button 
                    onClick={() => toast.success('Password updated successfully')}
                    className="mt-2 bg-alu-primary hover:bg-alu-primary/90"
                  >
                    <Lock size={16} className="mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p>Enhance your account security with 2FA</p>
                    <p className="text-sm text-gray-500">
                      Two-factor authentication adds an extra layer of security to your account
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info('This feature is coming soon!')}
                  >
                    Enable 2FA
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Login Sessions</h3>
                <div className="space-y-2">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">Windows • Chrome • New Delhi, India</p>
                        <p className="text-xs text-gray-400 mt-1">Started: {new Date().toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 mt-2"
                    onClick={() => toast.info('This feature is coming soon!')}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Logout All Other Devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
