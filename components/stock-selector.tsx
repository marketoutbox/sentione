"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { stocks as allAvailableStocks } from "@/data/stocks" // Assuming this path is correct

interface Stock {
  id: string | number
  symbol: string
  name: string
  sector?: string
  allocation?: number
  locked?: boolean
}

interface StockSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedStocks: Stock[]
  onSaveStocks: (stocks: Stock[]) => void
}

export const StockSelector: React.FC<StockSelectorProps> = ({ open, onOpenChange, selectedStocks, onSaveStocks }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [localSelectedStockIds, setLocalSelectedStockIds] = useState<Set<string | number>>(new Set())

  useEffect(() => {
    if (open) {
      setLocalSelectedStockIds(new Set(selectedStocks.map((s) => s.id)))
      setSearchTerm("") // Clear search term when opening
    }
  }, [open, selectedStocks])

  const filteredStocks = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return allAvailableStocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        stock.symbol.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }, [searchTerm])

  const handleCheckboxChange = (stockId: string | number, isChecked: boolean) => {
    setLocalSelectedStockIds((prev) => {
      const newSet = new Set(prev)
      if (isChecked) {
        newSet.add(stockId)
      } else {
        newSet.delete(stockId)
      }
      return newSet
    })
  }

  const handleSave = () => {
    const stocksToSave = allAvailableStocks.filter((stock) => localSelectedStockIds.has(stock.id))

    // Merge with existing allocations/locked states if available
    const finalStocks = stocksToSave.map((newStock) => {
      const existingStock = selectedStocks.find((s) => s.id === newStock.id)
      return {
        ...newStock,
        allocation: existingStock?.allocation || 0, // Keep existing allocation or default to 0
        locked: existingStock?.locked || false, // Keep existing locked state or default to false
      }
    })

    onSaveStocks(finalStocks)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-card-foreground">Select Stocks</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Choose which stocks to include in your basket.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Input
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 bg-background border-border text-foreground"
          />
          <ScrollArea className="h-64 pr-4">
            <div className="grid gap-2">
              {filteredStocks.length === 0 && <p className="text-center text-muted-foreground">No stocks found.</p>}
              {filteredStocks.map((stock) => (
                <div key={stock.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stock-${stock.id}`}
                    checked={localSelectedStockIds.has(stock.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(stock.id, !!checked)}
                  />
                  <Label htmlFor={`stock-${stock.id}`} className="text-foreground">
                    {stock.symbol} - {stock.name}
                    {stock.sector && <span className="text-muted-foreground ml-2 text-sm">({stock.sector})</span>}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-accent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save Selection
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
