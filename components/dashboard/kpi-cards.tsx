"use client"

import { Laptop, Zap, TrendingDown } from "lucide-react"

interface KPICardsProps {
  kpis: {
    totalProducts: number
    opportunities: number
    cheapestStore: string
  }
}

export default function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      title: "Total de Productos trackeados",
      value: kpis.totalProducts.toLocaleString(),
      icon: Laptop,
      bgColor: "bg-blue-50 dark:bg-blue-950",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Oportunidades detectadas",
      value: kpis.opportunities,
      icon: Zap,
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Tienda más barata hoy",
      value: kpis.cheapestStore,
      icon: TrendingDown,
      bgColor: "bg-purple-50 dark:bg-purple-950",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
              </div>
              <div className={`${card.bgColor} rounded-lg p-3`}>
                <Icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
