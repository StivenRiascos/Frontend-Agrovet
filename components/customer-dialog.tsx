"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Customer } from "@/app/dashboard/customers/page"

type CustomerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer | Omit<Customer, "id" | "totalPurchases" | "lastPurchase">) => void
  customer?: Customer | null
}

export function CustomerDialog({ open, onOpenChange, onSave, customer }: CustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      })
    }
  }, [customer, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (customer) {
      onSave({
        ...customer,
        ...formData,
      })
    } else {
      onSave(formData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
          <DialogDescription>
            {customer ? "Modifica los detalles del cliente" : "Completa el formulario para agregar un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="cliente@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8900"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Calle, número, ciudad..."
                required
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{customer ? "Guardar Cambios" : "Agregar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
