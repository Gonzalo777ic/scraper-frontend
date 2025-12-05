"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/dashboard/header";
import KPICards from "@/components/dashboard/kpi-cards";
import Charts from "@/components/dashboard/charts";
import DataTable from "@/components/dashboard/data-table";

// Definir la interfaz completa
interface Product {
  product_id: string;
  name: string;
  price: number;
  store: string;
  image_url: string | null;
  timestamp: string;
  // Campos de IA
  veredicto?: string;
  price_real?: number;
  price_ia?: number;
  ahorro_pct?: number;
}

// Interfaz para la respuesta de BigQuery
interface AnalysisData {
  product_id: string;
  precio_justo_ia: number;
  ahorro_pct: number;
  veredicto: string;
}

export default function PriceDashboard() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState("all");
  // Amplié el rango por defecto para ver laptops caras
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [verdict, setVerdict] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // --- FETCH DE DATOS REALES (POSTGRES + BIGQUERY) ---
  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://34.118.235.125"; // Asegúrate de que esta IP sea la correcta

        console.log("Iniciando carga de datos desde:", apiUrl);

        const [pricesRes, analysisRes] = await Promise.all([
          fetch(`${apiUrl}/prices`),
          fetch(`${apiUrl}/analysis`),
        ]);

        if (!pricesRes.ok)
          throw new Error("Error cargando precios de Postgres");

        const rawPrices = await pricesRes.json();
        let rawAnalysis: AnalysisData[] = [];

        if (analysisRes.ok) {
          const result = await analysisRes.json();

          // --- AQUÍ ESTÁ EL ARREGLO ---
          // Verificamos si lo que llegó es realmente un Array (Lista)
          if (Array.isArray(result)) {
            rawAnalysis = result;
          } else {
            // Si llega un objeto (probablemente un error), lo mostramos en consola y seguimos sin IA
            console.error("⚠️ Error en respuesta de IA (BigQuery):", result);
            // rawAnalysis se queda como []
          }
        } else {
          console.warn("El endpoint /analysis falló.");
        }

        // 2. Crear mapa (Ahora seguro porque rawAnalysis siempre será un array)
        const analysisMap = new Map(
          rawAnalysis.map((item) => [item.product_id, item])
        );

        // 3. Combinar
        const mergedData = rawPrices.map((item: any) => {
          const aiData = analysisMap.get(item.product_id);

          return {
            ...item,
            price_real: item.price,
            price_ia: aiData ? aiData.precio_justo_ia : null,
            ahorro_pct: aiData ? aiData.ahorro_pct : 0,
            veredicto: aiData ? aiData.veredicto : "⏳ Pendiente",
          };
        });

        setData(mergedData);
      } catch (err) {
        console.error("Error fatal en fetch:", err);
        setError("No se pudo cargar la información. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product_id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStore =
        selectedStore === "all" || item.store === selectedStore;
      const matchesPrice =
        (item.price_real || 0) >= priceRange[0] &&
        (item.price_real || 0) <= priceRange[1];

      // Filtro de Veredicto (Nuevo)
      const matchesVerdict = verdict === "all" || item.veredicto === verdict;

      return matchesSearch && matchesStore && matchesPrice && matchesVerdict;
    });
  }, [data, searchQuery, selectedStore, priceRange, verdict]);

  // Get unique stores & verdicts
  const stores = ["all", ...new Set(data.map((item) => item.store))];
  const verdicts = [
    "all",
    ...Array.from(
      new Set(
        data.map((item) => item.veredicto).filter((v): v is string => !!v)
      )
    ),
  ];
  // KPI calculations
  const kpis = {
    totalProducts: data.length,
    opportunities: data.filter((d) => (d.ahorro_pct || 0) > 10).length, // Ofertas reales detectadas
    cheapestStore:
      data.length > 0
        ? data.reduce((min, p) => (p.price < min.price ? p : min), data[0])
            .store
        : "-",
  };

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-muted-foreground">
          Sincronizando PostgreSQL y BigQuery...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-balance text-3xl font-bold text-foreground">
              Monitor de Precios GKE
            </h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <span
                className={`inline-block h-3 w-3 rounded-full ${
                  data.length > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              PostgreSQL + BigQuery Integration
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            Actualizado: {new Date().toLocaleDateString()}
          </div>
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
  );
}
