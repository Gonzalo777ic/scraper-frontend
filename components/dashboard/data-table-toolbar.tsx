"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableToolbarProps {
  stores: string[];
  verdicts: string[];
  selectedStore: string;
  onStoreChange: (store: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  verdict: string;
  onVerdictChange: (verdict: string) => void;
}

export function DataTableToolbar({
  stores,
  verdicts,
  selectedStore,
  onStoreChange,
  priceRange,
  onPriceRangeChange,
  verdict,
  onVerdictChange,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filtro por Tienda */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            Store: {selectedStore === "all" ? "All" : selectedStore}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Store</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedStore}
            onValueChange={onStoreChange}
          >
            {stores.map((store) => (
              <DropdownMenuRadioItem key={store} value={store}>
                {store === "all" ? "All Stores" : store}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filtro por Veredicto */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            Verdict: {verdict === "all" ? "All" : verdict.substring(0, 8)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Verdict</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={verdict}
            onValueChange={onVerdictChange}
          >
            {verdicts.map((v) => (
              <DropdownMenuRadioItem key={v} value={v}>
                {v === "all" ? "All Verdicts" : v}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rango de Precios */}
      <div className="flex items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
        <span className="text-muted-foreground text-xs font-medium uppercase">
          Price Range
        </span>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange[0]}
          onChange={(e) =>
            onPriceRangeChange([Number(e.target.value), priceRange[1]])
          }
          className="w-20 cursor-pointer accent-primary"
        />
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange[1]}
          onChange={(e) =>
            onPriceRangeChange([priceRange[0], Number(e.target.value)])
          }
          className="w-20 cursor-pointer accent-primary"
        />
        <span className="text-xs font-medium tabular-nums text-foreground">
          S/{priceRange[0]} - S/{priceRange[1]}
        </span>
      </div>
    </div>
  );
}