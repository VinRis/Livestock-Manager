
"use client"

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Clock, DollarSign, ClipboardList, ArrowUp, ArrowDown } from "lucide-react";
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
      netProfitComparison,
      incomeComparison,
      expenseComparison,
      periodLabel
  } = useMemo(() => {
      const now = new Date();
      let filteredFinancials: FinancialRecord[] = [];
      let previousPeriodFinancials: FinancialRecord[] = [];
      let label = '';

      switch (period) {
          case 'this_month':
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

              filteredFinancials = financialData.filter(r => {
                  const recordDate = new Date(r.date);
                  return recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() === now.getMonth();
              });
              previousPeriodFinancials = financialData.filter(r => {
                  const recordDate = new Date(r.date);
                  return recordDate >= startOfLastMonth && recordDate <= endOfLastMonth;
              });
              label = 'vs. last month';
              break;
          case 'last_30':
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              const sixtyDaysAgo = new Date();
              sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

              filteredFinancials = financialData.filter(r => new Date(r.date) >= thirtyDaysAgo);
              previousPeriodFinancials = financialData.filter(r => {
                  const recordDate = new Date(r.date);
                  return recordDate >= sixtyDaysAgo && recordDate < thirtyDaysAgo;
              });
              label = 'vs. previous 30 days';
              break;
          case 'this_year':
              const startOfYear = new Date(now.getFullYear(), 0, 1);
              const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
              const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
              
              filteredFinancials = financialData.filter(r => new Date(r.date).getFullYear() === now.getFullYear());
               previousPeriodFinancials = financialData.filter(r => {
                  const recordDate = new Date(r.date);
                  return recordDate >= startOfLastYear && recordDate <= endOfLastYear;
              });
              label = 'vs. last year';
              break;
          case 'all_time':
          default:
              filteredFinancials = financialData;
              previousPeriodFinancials = []; // No comparison for all time
              label = 'all time';
              break;
      }
      
      const calculateStats = (data: FinancialRecord[]) => {
        const income = data.filter(r => r.type === 'Income').reduce((sum, r) => sum + r.amount, 0);
        const expense = data.filter(r => r.type === 'Expense').reduce((sum, r) => sum + r.amount, 0);
        const net = income - expense;
        return { income, expense, net };
      };
      
      const currentStats = calculateStats(filteredFinancials);
      const previousStats = calculateStats(previousPeriodFinancials);

      const calculateComparison = (current: number, previous: number) => {
          if (previous === 0) {
              return current > 0 ? 100 : 0; 
          }
          if (current === 0 && previous > 0) {
            return -100;
          }
          return ((current - previous) / previous) * 100;
      };

      const netProfitComparison = period === 'all_time' ? null : calculateComparison(currentStats.net, previousStats.net);
      const incomeComparison = period === 'all_time' ? null : calculateComparison(currentStats.income, previousStats.income);
      const expenseComparison = period === 'all_time' ? null : calculateComparison(currentStats.expense, previousStats.expense);

      return {
          netProfit: currentStats.net,
          totalIncome: currentStats.income,
          totalExpense: currentStats.expense,
          netProfitComparison,
          incomeComparison,
          expenseComparison,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center sm:text-left">
              <div className={cn("text-2xl font-bold", netProfit >= 0 ? "text-primary" : "text-destructive")}>{currency}{netProfit.toLocaleString()}</div>
                {netProfitComparison !== null ? (
                  <p className={cn("text-xs flex items-center justify-center sm:justify-start gap-1", netProfitComparison > 0 ? "text-primary" : netProfitComparison < 0 ? "text-destructive" : "text-muted-foreground")}>
                    {netProfitComparison > 0 && <ArrowUp className="h-3 w-3" />}
                    {netProfitComparison < 0 && <ArrowDown className="h-3 w-3" />}
                    {netProfitComparison !== 0 ? `${Math.abs(netProfitComparison).toFixed(1)}%` : 'No change'}
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Net profit {periodLabel}</p>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center sm:text-left">
              <div className="text-2xl font-bold text-primary">{currency}{totalIncome.toLocaleString()}</div>
               {incomeComparison !== null ? (
                  <p className={cn("text-xs flex items-center justify-center sm:justify-start gap-1", incomeComparison > 0 ? "text-primary" : incomeComparison < 0 ? "text-destructive" : "text-muted-foreground")}>
                    {incomeComparison > 0 && <ArrowUp className="h-3 w-3" />}
                    {incomeComparison < 0 && <ArrowDown className="h-3 w-3" />}
                    {incomeComparison !== 0 ? `${Math.abs(incomeComparison).toFixed(1)}%` : 'No change'}
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Total income {periodLabel}</p>
                )}
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center sm:text-left">
              <div className="text-2xl font-bold text-destructive">{currency}{totalExpense.toLocaleString()}</div>
              {expenseComparison !== null ? (
                  <p className={cn("text-xs flex items-center justify-center sm:justify-start gap-1", expenseComparison > 0 ? "text-destructive" : expenseComparison < 0 ? "text-primary" : "text-muted-foreground")}>
                    {expenseComparison > 0 && <ArrowUp className="h-3 w-3" />}
                    {expenseComparison < 0 && <ArrowDown className="h-3 w-3" />}
                    {expenseComparison !== 0 ? `${Math.abs(expenseComparison).toFixed(1)}%` : 'No change'}
                    <span className="text-muted-foreground ml-1">{periodLabel}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">Total expenses {periodLabel}</p>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-center sm:text-left">
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
