"use client"

import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartsProps {
  data: any[]
}

export default function Charts({ data }: ChartsProps) {
  // Calculate average price by store
  const storeAverage = Array.from(
    new Map(
      data
        .reduce(
          (acc, item) => {
            const existing = acc.find((x) => x.store === item.store)
            if (existing) {
              existing.prices.push(item.price_real)
            } else {
              acc.push({ store: item.store, prices: [item.price_real] })
            }
            return acc
          },
          [] as Array<{ store: string; prices: number[] }>,
        )
        .map((item) => [
          item.store,
          {
            store: item.store,
            promedio: Math.round(item.prices.reduce((a, b) => a + b, 0) / item.prices.length),
          },
        ]),
    ).values(),
  )

  // Scatter data for Real Price vs IA Price
  const scatterData = data.slice(0, 30).map((item) => ({
    priceReal: item.price_real,
    priceIA: item.price_ia,
    name: item.name.substring(0, 10),
  }))

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Average Price by Store</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeAverage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="store" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Real Price vs AI Price</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priceReal" name="Real Price" />
              <YAxis dataKey="priceIA" name="AI Price" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Price Comparison" data={scatterData} fill="hsl(var(--chart-2))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
