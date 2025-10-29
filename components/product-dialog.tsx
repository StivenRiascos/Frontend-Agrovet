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
import type { Product } from "@/app/dashboard/products/page"

type ProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Product | Omit<Product, "id">) => void
  product?: Product | null
}

export function ProductDialog({ open, onOpenChange, onSave, product }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
    barcode: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        unit: product.unit,
        barcode: product.barcode || "",
      })
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        unit: "",
        barcode: Math.random().toString().slice(2, 15),
      })
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number.parseFloat(formData.price),
      stock: Number.parseInt(formData.stock),
      unit: formData.unit,
      barcode: formData.barcode,
    }

    if (product) {
      onSave({ ...productData, id: product.id })
    } else {
      onSave(productData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateBarcode = () => {
    const newBarcode = Math.random().toString().slice(2, 15)
    setFormData((prev) => ({ ...prev, barcode: newBarcode }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
          <DialogDescription>
            {product ? "Modifica los detalles del producto" : "Completa el formulario para agregar un nuevo producto"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="cursor-pointer">
                Nombre
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ej: Fertilizante NPK"
                className="cursor-text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="cursor-pointer">
                Categoría
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Ej: Fertilizantes"
                className="cursor-text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode" className="cursor-pointer">
                Código de Barras
              </Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleChange("barcode", e.target.value)}
                  placeholder="Código de barras"
                  className="cursor-text"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateBarcode}
                  className="cursor-pointer bg-transparent"
                >
                  Generar
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="cursor-pointer">
                  Precio
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="0.00"
                  className="cursor-text"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="cursor-pointer">
                  Stock
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  placeholder="0"
                  className="cursor-text"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="cursor-pointer">
                Unidad
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                placeholder="Ej: kg, saco, litro"
                className="cursor-text"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" className="cursor-pointer">
              {product ? "Guardar Cambios" : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
