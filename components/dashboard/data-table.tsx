"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface DataTableProps {
  data: any[]
  stores: string[]
  verdicts: string[]
  selectedStore: string
  onStoreChange: (store: string) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  verdict: string
  onVerdictChange: (verdict: string) => void
  currentPage: number
  onPageChange: (page: number) => void
}

const ITEMS_PER_PAGE = 10

export default function DataTable({
  data,
  stores,
  verdicts,
  selectedStore,
  onStoreChange,
  priceRange,
  onPriceRangeChange,
  verdict,
  onVerdictChange,
  currentPage,
  onPageChange,
}: DataTableProps) {
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getVerdictColor = (veredicto: string) => {
    if (veredicto.includes("SUPER")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
    if (veredicto.includes("BUEN")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getSavingsColor = (savings: number) => {
    if (savings > 15) return "text-emerald-600 dark:text-emerald-400"
    if (savings > 5) return "text-blue-600 dark:text-blue-400"
    return "text-muted-foreground"
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Store: {selectedStore === "all" ? "All" : selectedStore}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Store</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedStore} onValueChange={onStoreChange}>
              {stores.map((store) => (
                <DropdownMenuRadioItem key={store} value={store}>
                  {store === "all" ? "All Stores" : store}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Verdict: {verdict === "all" ? "All" : verdict.substring(0, 8)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Verdict</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={verdict} onValueChange={onVerdictChange}>
              {verdicts.map((v) => (
                <DropdownMenuRadioItem key={v} value={v}>
                  {v === "all" ? "All Verdicts" : v}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Price Range:</label>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            className="w-24"
          />
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-24"
          />
          <span className="text-sm text-muted-foreground">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Store</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Real Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">AI Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Savings %</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.name}</p>
                    <div className="mt-1 flex gap-1">
                      {item.specs &&
                        Object.entries(item.specs).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{item.store}</td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ${item.price_real.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground line-through">
                  ${item.price_ia.toLocaleString()}
                </td>
                <td className={`px-6 py-4 text-sm font-semibold ${getSavingsColor(item.ahorro_pct)}`}>
                  {item.ahorro_pct.toFixed(1)}%
                </td>
                <td className="px-6 py-4">
                  <Badge className={getVerdictColor(item.veredicto)}>{item.veredicto}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} of {data.length} products
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
