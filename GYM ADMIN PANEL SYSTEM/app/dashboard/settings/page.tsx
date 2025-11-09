'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Save, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [clubInfo, setClubInfo] = useState({
    name: 'Elite Fitness Club',
    address: '123 Main Street',
    city: 'New York',
    phone: '+1 (555) 123-4567',
    email: 'info@elitefitness.com',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'club_info')
        .maybeSingle();

      if (error) throw error;
      if (data?.setting_value) {
        setClubInfo(data.setting_value as any);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveClubInfo = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: clubInfo })
        .eq('setting_key', 'club_info');

      if (error) throw error;

      toast.success('Club information updated successfully!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configure your gym management system
          </p>
        </div>
      </div>

      <Tabs defaultValue="club" className="space-y-6">
        <TabsList>
          <TabsTrigger value="club">Club Information</TabsTrigger>
          <TabsTrigger value="payment">Payment Gateway</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="club">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-slate-900 dark:text-white">Club Information</CardTitle>
                  <CardDescription>Update your gym's basic details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="club_name">Club Name</Label>
                  <Input
                    id="club_name"
                    value={clubInfo.name}
                    onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club_email">Email</Label>
                  <Input
                    id="club_email"
                    type="email"
                    value={clubInfo.email}
                    onChange={(e) => setClubInfo({ ...clubInfo, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club_phone">Phone</Label>
                  <Input
                    id="club_phone"
                    value={clubInfo.phone}
                    onChange={(e) => setClubInfo({ ...clubInfo, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="club_city">City</Label>
                  <Input
                    id="club_city"
                    value={clubInfo.city}
                    onChange={(e) => setClubInfo({ ...clubInfo, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="club_address">Address</Label>
                  <Input
                    id="club_address"
                    value={clubInfo.address}
                    onChange={(e) => setClubInfo({ ...clubInfo, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveClubInfo}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Payment Gateway</CardTitle>
              <CardDescription>Configure Stripe integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400">
                <div className="text-center space-y-4">
                  <SettingsIcon className="w-16 h-16 mx-auto opacity-30" />
                  <p className="text-lg font-medium">Payment Gateway Configuration</p>
                  <p className="text-sm">Stripe integration setup coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Notification Templates</CardTitle>
              <CardDescription>Customize email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400">
                <div className="text-center space-y-4">
                  <SettingsIcon className="w-16 h-16 mx-auto opacity-30" />
                  <p className="text-lg font-medium">Notification Management</p>
                  <p className="text-sm">Email template editor coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
