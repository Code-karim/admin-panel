'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, DollarSign, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  plan_type: string;
  billing_cycle: string;
  is_active: boolean;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
  payment_method: string;
  invoice_number: string;
  members: { full_name: string };
}

export default function BillingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addPlanOpen, setAddPlanOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    plan_type: 'unlimited',
    duration_months: 1,
    price: '',
    billing_cycle: 'monthly',
  });

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      const [plansResult, paymentsResult] = await Promise.all([
        supabase.from('subscription_plans').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*, members(full_name)').order('payment_date', { ascending: false }).limit(20),
      ]);

      if (plansResult.data) setPlans(plansResult.data);
      if (paymentsResult.data) setPayments(paymentsResult.data as any);
    } catch (error) {
      console.error('Error loading billing data:', error);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async () => {
    try {
      const { error } = await supabase.from('subscription_plans').insert({
        ...newPlan,
        price: parseFloat(newPlan.price),
      });

      if (error) throw error;

      toast.success('Subscription plan created successfully!');
      setAddPlanOpen(false);
      setNewPlan({
        name: '',
        description: '',
        plan_type: 'unlimited',
        duration_months: 1,
        price: '',
        billing_cycle: 'monthly',
      });
      loadBillingData();
    } catch (error: any) {
      console.error('Error adding plan:', error);
      toast.error(error.message || 'Failed to create plan');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: any; className: string }> = {
      successful: { icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
      pending: { icon: Clock, className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
      failed: { icon: XCircle, className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' },
    };

    const item = config[status] || config.pending;
    const Icon = item.icon;

    return (
      <Badge className={item.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Billing & Subscriptions</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage subscription plans and track payments
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Revenue
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              ${payments.filter(p => p.status === 'successful').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Successful Payments
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {payments.filter(p => p.status === 'successful').length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Pending Payments
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {payments.filter(p => p.status === 'pending' || p.status === 'failed').length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-900 dark:text-white">Subscription Plans</CardTitle>
                  <CardDescription>Create and manage membership plans</CardDescription>
                </div>
                <Dialog open={addPlanOpen} onOpenChange={setAddPlanOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/30">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Subscription Plan</DialogTitle>
                      <DialogDescription>Set up a new membership plan</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan_name">Plan Name *</Label>
                        <Input
                          id="plan_name"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                          placeholder="Monthly Gold Membership"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newPlan.description}
                          onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                          placeholder="Unlimited access to all facilities..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plan_type">Plan Type</Label>
                          <Select value={newPlan.plan_type} onValueChange={(v) => setNewPlan({ ...newPlan, plan_type: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unlimited">Unlimited Access</SelectItem>
                              <SelectItem value="class_pack">Class Pack</SelectItem>
                              <SelectItem value="personal_training">Personal Training</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billing_cycle">Billing Cycle</Label>
                          <Select value={newPlan.billing_cycle} onValueChange={(v) => setNewPlan({ ...newPlan, billing_cycle: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                              <SelectItem value="one_time">One Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={newPlan.price}
                            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                            placeholder="99.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (months)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newPlan.duration_months}
                            onChange={(e) => setNewPlan({ ...newPlan, duration_months: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddPlanOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddPlan} disabled={!newPlan.name || !newPlan.price}>
                        Create Plan
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-slate-200 dark:border-slate-800">
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-10 w-24 mb-4" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))
                ) : plans.length > 0 ? (
                  plans.map((plan) => (
                    <Card key={plan.id} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          {plan.is_active && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                              Active
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="capitalize">
                          {plan.plan_type.replace('_', ' ')} • {plan.billing_cycle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                          ${plan.price}
                          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                            /{plan.billing_cycle === 'one_time' ? 'once' : plan.billing_cycle.replace('ly', '')}
                          </span>
                        </div>
                        <Button variant="outline" className="w-full">
                          Edit Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">
                    No subscription plans yet. Create your first plan!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Payment History</CardTitle>
              <CardDescription>View all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        </TableRow>
                      ))
                    ) : payments.length > 0 ? (
                      payments.map((payment) => (
                        <TableRow key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <TableCell className="font-mono text-sm">{payment.invoice_number || 'N/A'}</TableCell>
                          <TableCell className="font-medium">{payment.members.full_name}</TableCell>
                          <TableCell className="font-semibold">${Number(payment.amount).toFixed(2)}</TableCell>
                          <TableCell className="capitalize">{payment.payment_method}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-400">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">
                          No payment records yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
