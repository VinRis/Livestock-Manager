
"use client"

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Clock, DollarSign, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { type Activity, type Task, type FinancialRecord } from "@/lib/data";
import { cn } from "@/lib/utils";
import FinanceChart from "./finance/finance-chart";
import { useCurrency } from "@/contexts/currency-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Period = 'this_month' | 'last_30' | 'this_year' | 'all_time';

export default function DashboardPage() {
  const { currency } = useCurrency();
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [financialData, setFinancialData] = useState<FinancialRecord[]>([]);
  const [period, setPeriod] = useState<Period>('this_month');

  useEffect(() => {
    // Activities
    try {
      const storedActivities = window.localStorage.getItem('activityLogData');
      const loadedActivities: Activity[] = storedActivities ? JSON.parse(storedActivities) : [];
      const sorted = loadedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(sorted.slice(0, 3));
    } catch (error) {
      console.error("Failed to load activity log for dashboard", error);
      setRecentActivities([]);
    }
    
    // Tasks
    try {
        const storedTasks = window.localStorage.getItem('tasksData');
        const loadedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];
        const today = new Date().setHours(0, 0, 0, 0);
        const filteredTasks = loadedTasks.filter(task => new Date(task.dueDate).setHours(0, 0, 0, 0) === today && !task.completed);
        setTodaysTasks(filteredTasks);
    } catch (error) {
        console.error("Failed to load tasks for dashboard", error);
        setTodaysTasks([]);
    }
      
    // Financials
    try {
        const storedFinancials = window.localStorage.getItem('financialData');
        const loadedFinancials: FinancialRecord[] = storedFinancials ? JSON.parse(storedFinancials) : [];
        setFinancialData(loadedFinancials);
    } catch (error) {
        console.error("Failed to load financials for dashboard", error);
        setFinancialData([]);
    }
  }, []);

  const {
      netProfit,
      totalIncome,
      totalExpense,
      periodLabel
  } = useMemo(() => {
      const now = new Date();
      let filteredFinancials = financialData;
      let label = '';

      switch (period) {
          case 'this_month':
              filteredFinancials = financialData.filter(r => {
                  const recordDate = new Date(r.date);
                  return recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() === now.getMonth();
              });
              label = 'this month';
              break;
          case 'last_30':
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              filteredFinancials = financialData.filter(r => new Date(r.date) >= thirtyDaysAgo);
              label = 'last 30 days';
              break;
          case 'this_year':
              filteredFinancials = financialData.filter(r => new Date(r.date).getFullYear() === now.getFullYear());
              label = 'this year';
              break;
          case 'all_time':
          default:
              filteredFinancials = financialData;
              label = 'all time';
              break;
      }

      const income = filteredFinancials.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
      const expense = filteredFinancials.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
      const net = income - expense;

      return {
          netProfit: net,
          totalIncome: income,
          totalExpense: expense,
          periodLabel: label,
      };
  }, [financialData, period]);
  
  const filterButtons = [
    { label: 'This Month', value: 'this_month' as Period },
    { label: '30 Days', value: 'last_30' as Period },
    { label: 'This Year', value: 'this_year' as Period },
    { label: 'All Time', value: 'all_time' as Period },
  ];
  
  return (
    <>
      <PageHeader title="Dashboard" />
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="flex justify-center sm:justify-start">
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {filterButtons.map(button => (
                <Button 
                    key={button.value}
                    size="sm" 
                    variant={period === button.value ? 'default' : 'ghost'} 
                    onClick={() => setPeriod(button.value)}
                    className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                >
                  {button.label}
                </Button>
              ))}
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", netProfit >= 0 ? "text-primary" : "text-destructive")}>{currency}{netProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Net profit {periodLabel}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{currency}{totalIncome.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">Total income {periodLabel}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{currency}{totalExpense.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total expenses {periodLabel}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaysTasks.length}</div>
              <p className="text-xs text-muted-foreground">tasks due today</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Profitability Overview</CardTitle>
              <CardDescription>A summary of your income vs expenses.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
               <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Report</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Profitability Overview</DialogTitle>
                      <DialogDescription>
                        A month-by-month breakdown of your income and expenses.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="h-[400px] w-full pt-4 overflow-x-auto">
                      <FinanceChart data={financialData} />
                    </div>
                  </DialogContent>
                </Dialog>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>A log of the latest activities on your farm.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <ClipboardList className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground p-4">No recent activity.</div>
                )}
                 <Button asChild variant="outline" className="w-full">
                  <Link href="/activity">View All Activities</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
