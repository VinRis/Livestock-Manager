
"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle, Clock, DollarSign, PlusCircle, ClipboardList, BarChart3 } from "lucide-react";
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


export default function DashboardPage() {
  const { currency } = useCurrency();
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [netProfit, setNetProfit] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

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
        
        const income = loadedFinancials.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
        const expense = loadedFinancials.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
        
        setTotalIncome(income);
        setTotalExpense(expense);
        setNetProfit(income - expense);
    } catch (error) {
        console.error("Failed to load financials for dashboard", error);
        setTotalIncome(0);
        setTotalExpense(0);
        setNetProfit(0);
    }
  }, []);
  
  return (
    <>
      <PageHeader title="Dashboard">
        <Button asChild>
          <Link href="/analytics">
            <BarChart3 />
            View Analytics
          </Link>
        </Button>
      </PageHeader>
      <main className="flex-1 space-y-4 p-4 pt-2 sm:p-6 sm:pt-2">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currency}{netProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currency}{totalIncome.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">Total income this year</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currency}{totalExpense.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total expenses this year</p>
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
                      <FinanceChart />
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
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                        <ClipboardList className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
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
