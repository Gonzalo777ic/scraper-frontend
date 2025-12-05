"use client";

import { 
  ChevronDown, 
  ChevronUp, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps {
  data: any[];
  stores: string[];
  verdicts: string[];
  selectedStore: string;
  onStoreChange: (store: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  verdict: string;
  onVerdictChange: (verdict: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

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
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getVerdictColor = (veredicto: string) => {
    if (veredicto.includes("SUPER"))
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100";
    if (veredicto.includes("BUEN"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
  };

  const getSavingsColor = (savings: number) => {
    if (savings > 15) return "text-emerald-600 dark:text-emerald-400";
    if (savings > 5) return "text-blue-600 dark:text-blue-400";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      {/* Modularized Toolbar */}
      <DataTableToolbar
        stores={stores}
        verdicts={verdicts}
        selectedStore={selectedStore}
        onStoreChange={onStoreChange}
        priceRange={priceRange}
        onPriceRangeChange={onPriceRangeChange}
        verdict={verdict}
        onVerdictChange={onVerdictChange}
      />

      {/* Table Structure */}
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground w-[80px]">
                  Img
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Real Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  AI Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Savings %
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Verdict
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {/* COLUMNA 1: IMAGEN */}
                  <td className="px-6 py-4 align-middle">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-border bg-white p-1">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt="Product" 
                          className="h-full w-full object-contain"
                          onError={(e) => {
                             // Fallback si la imagen falla al cargar
                             (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>

                  {/* COLUMNA 2: DETALLES PRODUCTO */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground text-sm line-clamp-2 max-w-[300px]" title={item.name}>
                        {item.name}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.specs &&
                          Object.entries(item.specs).slice(0, 3).map(([key, value]) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="text-[10px] h-5 px-1.5"
                            >
                              {key}: {String(value)}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.store}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    ${(item.price_real || 0).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground line-through">
                    ${(item.price_ia || 0).toLocaleString()}
                  </td>

                  <td
                    className={`px-6 py-4 text-sm font-semibold ${getSavingsColor(
                      item.ahorro_pct || 0
                    )}`}
                  >
                    {(item.ahorro_pct || 0).toFixed(1)}%
                  </td>

                  <td className="px-6 py-4">
                    <Badge className={getVerdictColor(item.veredicto || "N/A")}>
                      {item.veredicto || "Pendiente"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Optimizada para muchas páginas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, data.length)}</span> of{" "}
          <span className="font-medium">{data.length}</span> products
        </p>
        
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          {/* Botón Primera Página */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          {/* Botón Anterior */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Indicador de Página */}
          <div className="flex items-center justify-center text-sm font-medium w-[100px]">
            Page {currentPage} of {totalPages}
          </div>

          {/* Botón Siguiente */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Botón Última Página */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}