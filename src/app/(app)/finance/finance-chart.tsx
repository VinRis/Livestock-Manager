
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { financialData } from "@/lib/data"

const monthlyData = financialData.reduce((acc, record) => {
  const month = new Date(record.date).toLocaleString('default', { month: 'short' });
  if (!acc[month]) {
    acc[month] = { month, income: 0, expense: 0 };
  }
  if (record.type === 'Income') {
    acc[month].income += record.amount;
  } else {
    acc[month].expense += record.amount;
  }
  return acc;
}, {} as Record<string, { month: string; income: number; expense: number }>);

const chartData = Object.values(monthlyData).reverse();

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--primary))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export default function FinanceChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full md:min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
