"use client"

import { useState, useMemo, useEffect } from "react"
import Header from "@/components/dashboard/header"
import KPICards from "@/components/dashboard/kpi-cards"
import Charts from "@/components/dashboard/charts"
import DataTable from "@/components/dashboard/data-table"
// import { mockPriceData } from "@/lib/mock-data" // YA NO LO USAMOS

// Definir la interfaz de tus datos reales
interface Product {
  product_id: string
  name: string
  price: number // La API devuelve 'price' (o 'final_price_pen' si usas la vista)
  store: string
  image_url: string | null
  timestamp: string
  // Campos opcionales para compatibilidad con componentes existentes
  veredicto?: string 
  price_real?: number
  price_ia?: number
  ahorro_pct?: number
}

export default function PriceDashboard() {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStore, setSelectedStore] = useState("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000])
  const [verdict, setVerdict] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // --- FETCH DE DATOS REALES ---
  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://34.61.235.12';
        // Usamos el endpoint que devuelve TODO (cuidado con el peso)
        // Si pesa mucho, en el futuro implementar ?limit=100&page=1 en el backend
        const res = await fetch(`${apiUrl}/prices`);
        
        if (!res.ok) throw new Error("Error al conectar con la API");
        
        const rawData = await res.json();
        
        // Adaptar datos si es necesario (ej. mapear nombres de columnas)
        const adaptedData = rawData.map((item: any) => ({
          ...item,
          // Si tu API devuelve 'price', lo mapeamos a 'price_real' para que coincida con tu UI
          price_real: item.price, 
          price_ia: item.price, // Placeholder hasta que conectes la tabla de IA
          ahorro_pct: 0,       // Placeholder
          veredicto: "N/A"     // Placeholder
        }));

        setData(adaptedData);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información. Verifica que la API esté activa.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter logic (Igual que antes)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product_id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStore = selectedStore === "all" || item.store === selectedStore
      const matchesPrice = (item.price_real || item.price) >= priceRange[0] && (item.price_real || item.price) <= priceRange[1]
      
      return matchesSearch && matchesStore && matchesPrice
    })
  }, [data, searchQuery, selectedStore, priceRange])

  // Get unique stores for filter
  const stores = ["all", ...new Set(data.map((item) => item.store))]
  const verdicts = ["all"] // Simplificado por ahora

  // KPI calculations
  const kpis = {
    totalProducts: data.length,
    opportunities: 0, // Placeholder
    cheapestStore: data.length > 0 ? data.reduce((min, p) => p.price < min.price ? p : min, data[0]).store : "-",
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando datos del clúster...</div>
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-balance text-3xl font-bold text-foreground">Monitor de Precios GKE</h1>
          <p className="mt-2 text-muted-foreground">
            Datos en tiempo real desde Kubernetes (PostgreSQL)
          </p>
        </div>

        <KPICards kpis={kpis} />
        <Charts data={data} />

        <div className="mt-8">
          <DataTable
            data={filteredData}
            stores={stores}
            verdicts={verdicts}
            selectedStore={selectedStore}
            onStoreChange={setSelectedStore}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            verdict={verdict}
            onVerdictChange={setVerdict}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  )
}