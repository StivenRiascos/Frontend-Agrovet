"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Sprout } from "lucide-react"
import type { Quotation } from "@/app/dashboard/quotations/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type QuotationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (quotation: Omit<Quotation, "id">) => void
  quotation?: Quotation | null
}

type QuotationItem = {
  code: string
  productName: string
  quantity: number
  price: number
}

export function QuotationDialog({ open, onOpenChange, onSave, quotation }: QuotationDialogProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerDocument, setCustomerDocument] = useState("")
  const [status, setStatus] = useState<"Pendiente" | "Aprobada" | "Rechazada">("Pendiente")
  const [items, setItems] = useState<QuotationItem[]>([])
  const [newItem, setNewItem] = useState<QuotationItem>({
    code: "",
    productName: "",
    quantity: 1,
    price: 0,
  })

  const isViewMode = !!quotation

  useEffect(() => {
    if (quotation) {
      setCustomerName(quotation.customerName)
      setCustomerAddress(quotation.customerAddress)
      setCustomerPhone(quotation.customerPhone)
      setCustomerDocument(quotation.customerDocument)
      setStatus(quotation.status)
      setItems(quotation.items)
    } else {
      setCustomerName("")
      setCustomerAddress("")
      setCustomerPhone("")
      setCustomerDocument("")
      setStatus("Pendiente")
      setItems([])
      setNewItem({ code: "", productName: "", quantity: 1, price: 0 })
    }
  }, [quotation, open])

  const handleAddItem = () => {
    if (newItem.code && newItem.productName && newItem.quantity > 0 && newItem.price > 0) {
      setItems([...items, newItem])
      setNewItem({ code: "", productName: "", quantity: 1, price: 0 })
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

    const quotationData = {
      date: new Date().toISOString().split("T")[0],
      customerName,
      customerAddress,
      customerPhone,
      customerDocument,
      items,
      total: calculateTotal(),
      status,
    }

    onSave(quotationData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{isViewMode ? "Cotización" : "Nueva Cotización"}</DialogTitle>
              <p className="text-sm text-muted-foreground">AGRO INSUMOS EL CAMPO</p>
              <p className="text-xs text-muted-foreground">EL ALIADO PARA TUS CULTIVOS</p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Sr(es)</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre del cliente"
                  required
                  disabled={isViewMode}
                  className="cursor-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Razón Social / Dirección</Label>
                <Input
                  id="customerAddress"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Dirección o razón social"
                  disabled={isViewMode}
                  className="cursor-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerDocument">Rut/RUC/DNI</Label>
                <Input
                  id="customerDocument"
                  value={customerDocument}
                  onChange={(e) => setCustomerDocument(e.target.value)}
                  placeholder="Documento de identidad"
                  disabled={isViewMode}
                  className="cursor-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Celular</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Número de teléfono"
                  disabled={isViewMode}
                  className="cursor-text"
                />
              </div>
            </div>

            {isViewMode && (
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente" className="cursor-pointer">
                      Pendiente
                    </SelectItem>
                    <SelectItem value="Aprobada" className="cursor-pointer">
                      Aprobada
                    </SelectItem>
                    <SelectItem value="Rechazada" className="cursor-pointer">
                      Rechazada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {!isViewMode && (
              <div className="space-y-2">
                <Label>Agregar Producto</Label>
                <div className="grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-2">
                  <Input
                    placeholder="Código"
                    value={newItem.code}
                    onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                    className="cursor-text"
                  />
                  <Input
                    placeholder="Nombre del producto"
                    value={newItem.productName}
                    onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                    className="cursor-text"
                  />
                  <Input
                    type="number"
                    placeholder="Cant."
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
                    className="cursor-text"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) || 0 })}
                    className="cursor-text"
                  />
                  <Button type="button" size="icon" onClick={handleAddItem} className="cursor-pointer">
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
                      <TableHead>Cod</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Subtotal</TableHead>
                      {!isViewMode && <TableHead className="w-[50px]"></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isViewMode ? 5 : 6} className="text-center text-muted-foreground">
                          No hay productos agregados
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="font-medium">${(item.quantity * item.price).toFixed(2)}</TableCell>
                          {!isViewMode && (
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index)}
                                className="cursor-pointer"
                              >
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
              <span className="text-lg font-semibold">TOTAL:</span>
              <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button type="submit" className="cursor-pointer">
                Generar Cotización
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
