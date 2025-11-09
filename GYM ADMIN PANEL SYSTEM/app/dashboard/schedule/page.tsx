'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Class Schedule</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage group classes and schedules
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/30">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Class
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Weekly Schedule</CardTitle>
          <CardDescription>View and manage upcoming classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-24 text-slate-500 dark:text-slate-400">
            <div className="text-center space-y-4">
              <CalendarIcon className="w-16 h-16 mx-auto opacity-30" />
              <p className="text-lg font-medium">Schedule Management</p>
              <p className="text-sm">Calendar view and class scheduling coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
