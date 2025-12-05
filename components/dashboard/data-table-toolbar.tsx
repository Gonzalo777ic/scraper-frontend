"use client";

import { ChevronDown, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const RETAILER_GROUPS = [
  "Real Plaza",
  "Falabella",
  "Oechsle",
  "Ripley",
  "Plaza Vea",
  "Promart",
  "Hiraoka",
  "Coolbox",
  "Efe",
  "Curacao"
];

interface DataTableToolbarProps {
  stores: string[];
  verdicts: string[];
  selectedStore: string;
  onStoreChange: (store: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  verdict: string;
  onVerdictChange: (verdict: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
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
  searchQuery,
  onSearchChange,
}: DataTableToolbarProps) {
  


  const availableGroups = RETAILER_GROUPS.filter(group => 
    stores.some(s => s.toLowerCase().includes(group.toLowerCase()))
  );

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onPriceRangeChange([val, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onPriceRangeChange([priceRange[0], val]);
  };


  const getButtonLabel = () => {
    if (selectedStore === "all") return "All Stores";
    if (selectedStore.startsWith("GROUP_")) {
      return `${selectedStore.replace("GROUP_", "")} (Todos)`;
    }
    return selectedStore.length > 15 ? selectedStore.substring(0, 15) + "..." : selectedStore;
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-1">
      
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {}
        {onSearchChange && (
          <Input
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-[200px] lg:w-[300px]"
          />
        )}

        {}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed min-w-[140px] justify-between">
              <span className="flex items-center gap-2">
                 Store: <span className="font-semibold">{getButtonLabel()}</span>
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[260px] max-h-[500px] overflow-y-auto">
            <DropdownMenuLabel>Filter by Store</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={selectedStore}
              onValueChange={onStoreChange}
            >
              <DropdownMenuRadioItem value="all" className="font-bold">
                🌍 All Stores
              </DropdownMenuRadioItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Grupos (Cadenas)</DropdownMenuLabel>
              
              {}
              {availableGroups.map(group => (
                <DropdownMenuRadioItem
                  key={`group-${group}`}
                  value={`GROUP_${group}`}
                  className="font-semibold text-purple-600 dark:text-purple-400 pl-6"
                >
                  <ShoppingBag className="mr-2 h-3 w-3" /> 
                  {group} (Todos)
                </DropdownMenuRadioItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Vendedores Individuales</DropdownMenuLabel>
              
              {}
              {stores.map((store) => (
                <DropdownMenuRadioItem key={store} value={store} className="pl-6 text-sm">
                  {store}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed">
              Verdict: {verdict === "all" ? "All" : verdict}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>AI Verdict</DropdownMenuLabel>
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

        {}
        {(selectedStore !== "all" || verdict !== "all" || priceRange[0] > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onStoreChange("all");
              onVerdictChange("all");
              onPriceRangeChange([0, 15000]);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {}
      <div className="flex items-center gap-3 rounded-md border border-input bg-background/50 px-3 py-2 shadow-sm mt-3 md:mt-0">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
            Price Range (S/)
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="h-8 w-20 px-2 text-right"
            />
            <div className="flex flex-col gap-1 w-32 md:w-48">
              <input
                type="range"
                min="0"
                max="15000"
                step="100"
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="h-1.5 w-full cursor-pointer accent-primary bg-muted rounded-lg appearance-none"
              />
              <input
                type="range"
                min="0"
                max="15000"
                step="100"
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="h-1.5 w-full cursor-pointer accent-primary bg-muted rounded-lg appearance-none"
              />
            </div>
            <Input
              type="number"
              min={priceRange[0]}
              max={20000}
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="h-8 w-20 px-2 text-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
}