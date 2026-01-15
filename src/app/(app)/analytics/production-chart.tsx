
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", yield: 25.5 },
  { month: "February", yield: 26.2 },
  { month: "March", yield: 27.8 },
  { month: "April", yield: 28.1 },
  { month: "May", yield: 28.5 },
  { month: "June", yield: 27.9 },
]

const chartConfig = {
  yield: {
    label: "Yield (L/day)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function ProductionChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
       <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="yield" stroke="var(--color-yield)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
