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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import type { Sale } from "@/app/dashboard/sales/page"

type SaleDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (sale: Omit<Sale, "id">) => void
  sale?: Sale | null
}

type SaleItem = {
  productName: string
  quantity: number
  price: number
}

export function SaleDialog({ open, onOpenChange, onSave, sale }: SaleDialogProps) {
  const [customerName, setCustomerName] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Efectivo")
  const [items, setItems] = useState<SaleItem[]>([])
  const [newItem, setNewItem] = useState<SaleItem>({
    productName: "",
    quantity: 1,
    price: 0,
  })

  const isViewMode = !!sale

  useEffect(() => {
    if (sale) {
      setCustomerName(sale.customerName)
      setPaymentMethod(sale.paymentMethod)
      setItems(sale.items)
    } else {
      setCustomerName("")
      setPaymentMethod("Efectivo")
      setItems([])
      setNewItem({ productName: "", quantity: 1, price: 0 })
    }
  }, [sale, open])

  const handleAddItem = () => {
    if (newItem.productName && newItem.quantity > 0 && newItem.price > 0) {
      setItems([...items, newItem])
      setNewItem({ productName: "", quantity: 1, price: 0 })
    }
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      alert("Debes agregar al menos un producto")
      return
    }

    const saleData = {
      date: new Date().toISOString().split("T")[0],
      customerName,
      items,
      total: calculateTotal(),
      paymentMethod,
    }

    onSave(saleData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isViewMode ? "Detalle de Venta" : "Nueva Venta"}</DialogTitle>
          <DialogDescription>
            {isViewMode ? "Información completa de la venta" : "Completa el formulario para registrar una nueva venta"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Cliente</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre del cliente"
                  required
                  disabled={isViewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isViewMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="Transferencia">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!isViewMode && (
              <div className="space-y-2">
                <Label>Agregar Producto</Label>
                <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2">
                  <Input
                    placeholder="Nombre del producto"
                    value={newItem.productName}
                    onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Cant."
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                  />
                  <Button type="button" size="icon" onClick={handleAddItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Productos</Label>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Subtotal</TableHead>
                      {!isViewMode && <TableHead className="w-[50px]"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isViewMode ? 4 : 5} className="text-center text-muted-foreground">
                          No hay productos agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${(item.quantity * item.price).toFixed(2)}</TableCell>
                          {!isViewMode && (
                            <TableCell>
                              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && <Button type="submit">Registrar Venta</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
