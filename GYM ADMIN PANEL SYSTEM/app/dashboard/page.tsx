'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, DollarSign, TrendingUp, AlertCircle, Plus, UserPlus, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  newMembersThisMonth: number;
  expiringSubscriptions: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const [membersResult, newMembersResult, revenueResult, expiringResult, checkInsResult] = await Promise.all([
        supabase.from('members').select('id, status', { count: 'exact' }),
        supabase.from('members').select('id', { count: 'exact' }).gte('join_date', startOfMonth.toISOString().split('T')[0]),
        supabase.from('payments').select('amount').eq('status', 'successful').gte('payment_date', startOfMonth.toISOString()).lte('payment_date', endOfMonth.toISOString()),
        supabase.from('member_subscriptions').select('id', { count: 'exact' }).eq('status', 'active').lte('end_date', thirtyDaysFromNow.toISOString().split('T')[0]),
        supabase.from('check_ins').select('id, member_id, check_in_time, members(full_name)').order('check_in_time', { ascending: false }).limit(10)
      ]);

      const totalMembers = membersResult.count || 0;
      const activeMembers = membersResult.data?.filter(m => m.status === 'active').length || 0;
      const monthlyRevenue = revenueResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const newMembersThisMonth = newMembersResult.count || 0;
      const expiringSubscriptions = expiringResult.count || 0;

      setStats({
        totalMembers,
        activeMembers,
        monthlyRevenue,
        newMembersThisMonth,
        expiringSubscriptions,
      });

      const activities: RecentActivity[] = checkInsResult.data?.map(ci => ({
        id: ci.id,
        type: 'check_in',
        message: `${(ci.members as any)?.full_name || 'Member'} checked in`,
        timestamp: ci.check_in_time,
      })) || [];

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, trend, color }: any) => (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {loading ? <Skeleton className="h-9 w-24" /> : value}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/members">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers || 0}
          icon={Users}
          description={`${stats?.activeMembers || 0} active members`}
          color="bg-gradient-to-br from-blue-600 to-blue-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats?.monthlyRevenue.toLocaleString() || 0}`}
          icon={DollarSign}
          description="Total this month"
          trend="+12.5% from last month"
          color="bg-gradient-to-br from-emerald-600 to-emerald-500"
        />
        <StatCard
          title="New Members"
          value={stats?.newMembersThisMonth || 0}
          icon={TrendingUp}
          description="Joined this month"
          trend="+8.2% from last month"
          color="bg-gradient-to-br from-violet-600 to-violet-500"
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiringSubscriptions || 0}
          icon={AlertCircle}
          description="Within 30 days"
          color="bg-gradient-to-br from-orange-600 to-orange-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/dashboard/members">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold">Add New Member</span>
                </Button>
              </Link>
              <Link href="/dashboard/schedule">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:border-emerald-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  <span className="font-semibold">Create Class</span>
                </Button>
              </Link>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-violet-50 dark:hover:bg-violet-950 hover:border-violet-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <CreditCard className="w-6 h-6 text-violet-600" />
                  <span className="font-semibold">Process Payment</span>
                </Button>
              </Link>
              <Link href="/dashboard/staff">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-950 hover:border-orange-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <Plus className="w-6 h-6 text-orange-600" />
                  <span className="font-semibold">Add Staff Member</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Recent Activity</CardTitle>
            <CardDescription>Latest check-ins and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
