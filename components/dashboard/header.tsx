"use client"

import { useState } from "react"
import { Search, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  if (!mounted) {
    setMounted(true)
  }

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600">
              <span className="text-lg font-bold text-white">₿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Scraper</h1>
              <p className="text-xs text-muted-foreground">Trackeo</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products or IDs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-0 bg-background placeholder-muted-foreground focus-visible:ring-0"
            />
          </div>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg"
          >
            {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
