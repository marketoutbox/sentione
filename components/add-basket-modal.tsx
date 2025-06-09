"use client"

import type React from "react"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddBasketModalProps {
  open: boolean // Added prop for controlled state
  onOpenChange: (open: boolean) => void // Added prop for controlled state
  onCreateBasket: (basketName: string) => void // Renamed from onConfirm for clarity
  children: React.ReactNode
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

const AddBasketModal = ({
  open,
  onOpenChange,
  onCreateBasket,
  children,
  title = "Create New Basket",
  description = "Enter a name for your new stock basket.",
  confirmText = "Create Basket",
  cancelText = "Cancel",
}: AddBasketModalProps) => {
  const [newBasketName, setNewBasketName] = useState("")

  const handleConfirm = () => {
    if (newBasketName.trim()) {
      onCreateBasket(newBasketName.trim())
      setNewBasketName("") // Clear input after creation
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-sm sm:max-w-md bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="basket-name">Basket Name</Label>
            <Input
              id="basket-name"
              value={newBasketName}
              onChange={(e) => setNewBasketName(e.target.value)}
              placeholder="e.g., My Tech Portfolio"
              className="bg-background border-border text-foreground"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-background text-foreground border-border hover:bg-accent">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!newBasketName.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddBasketModal
