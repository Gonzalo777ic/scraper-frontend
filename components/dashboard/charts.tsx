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
  Cell,
  ReferenceLine
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartsProps {
  data: any[]
}

export default function Charts({ data }: ChartsProps) {
  

  const normalizeStore = (rawName: string) => {
    const lower = rawName.toLowerCase();
    
    if (lower.includes("real plaza")) return "Real Plaza";
    if (lower.includes("falabella")) return "Falabella";
    if (lower.includes("ripley")) return "Ripley";
    if (lower.includes("oechsle")) return "Oechsle";
    if (lower.includes("plaza vea")) return "Plaza Vea";
    if (lower.includes("promart")) return "Promart";
    if (lower.includes("hiraoka")) return "Hiraoka";
    if (lower.includes("curacao")) return "La Curacao";
    if (lower.includes("efe")) return "Tiendas Efe";
    if (lower.includes("coolbox")) return "Coolbox";
    


    return rawName;
  };


  const storeGroups = data.reduce((acc: Record<string, number[]>, item) => {
    const cleanName = normalizeStore(item.store);
    
    if (!acc[cleanName]) {
      acc[cleanName] = [];
    }

    acc[cleanName].push(item.price_real || 0);
    return acc;
  }, {});


  const chartData = Object.entries(storeGroups)
    .map(([store, prices]) => ({
      store,
      promedio: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      count: prices.length
    }))
    .sort((a, b) => b.promedio - a.promedio);


  const scatterData = data
    .filter(item => item.price_ia > 0)
    .slice(0, 50)
    .map((item) => ({
      priceReal: item.price_real,
      priceIA: item.price_ia,
      name: item.name.substring(0, 15) + "...",
      store: item.store
    }))

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {}
      <Card>
        <CardHeader>
          <CardTitle>Precio Promedio por Cadena</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="store" 
                angle={-45} 
                textAnchor="end" 
                interval={0}
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `S/ ${value}`} 
                width={80}
              />
              <Tooltip 
                formatter={(value: number) => [`S/ ${value}`, 'Precio Promedio']}
                labelStyle={{ color: 'black' }}
              />
              <Bar dataKey="promedio" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

{}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Valor: Real vs IA</CardTitle>
          <p className="text-sm text-muted-foreground">
            Puntos verdes: Ofertas | Puntos rojos: Sobreprecio
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              
              {}
              <XAxis 
                dataKey="priceReal" 
                name="Precio Real" 
                unit=" S/" 
                type="number"
                label={{ value: 'Precio en Tienda', position: 'insideBottom', offset: -10 }} 
              />
              <YAxis 
                dataKey="priceIA" 
                name="Precio IA" 
                unit=" S/" 
                type="number" 
                label={{ value: 'Valor según IA', angle: -90, position: 'insideLeft' }}
              />
              
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }} 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded p-2 shadow-md text-sm">
                        <p className="font-bold mb-1">{data.name}</p>
                        <p className="text-red-500">Tienda: S/ {data.priceReal}</p>
                        <p className="text-blue-500">IA: S/ {data.priceIA}</p>
                        <p className="text-gray-500 text-xs mt-1">{data.store}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {}
              {}
              <ReferenceLine 
                segment={[{ x: 0, y: 0 }, { x: 15000, y: 15000 }]} 
                stroke="gray" 
                strokeDasharray="3 3" 
                label="Precio Justo"
              />

              <Scatter name="Productos" data={scatterData}>
                {scatterData.map((entry, index) => {

                  const isDeal = entry.priceReal < entry.priceIA * 0.95;
                  const isOverpriced = entry.priceReal > entry.priceIA * 1.15;
                  
                  let color = "hsl(var(--chart-1))";
                  if (isDeal) color = "#10b981";
                  if (isOverpriced) color = "#ef4444";

                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Scatter>

            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}