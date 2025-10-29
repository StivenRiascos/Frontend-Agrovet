"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye } from "lucide-react"
import { SaleDialog } from "@/components/sale-dialog"
import { Badge } from "@/components/ui/badge"

export type Sale = {
  id: string
  date: string
  customerName: string
  items: Array<{
    productName: string
    quantity: number
    price: number
  }>
  total: number
  paymentMethod: string
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      date: "2025-01-15",
      customerName: "Juan Pérez",
      items: [
        { productName: "Fertilizante NPK", quantity: 2, price: 25.5 },
        { productName: "Alimento para Ganado", quantity: 1, price: 45.0 },
      ],
      total: 96.0,
      paymentMethod: "Efectivo",
    },
    {
      id: "2",
      date: "2025-01-14",
      customerName: "María González",
      items: [{ productName: "Alimento para Ganado", quantity: 3, price: 45.0 }],
      total: 135.0,
      paymentMethod: "Tarjeta",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingSale, setViewingSale] = useState<Sale | null>(null)

  const filteredSales = sales.filter(
    (sale) =>
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddSale = (sale: Omit<Sale, "id">) => {
    const newSale = {
      ...sale,
      id: Date.now().toString(),
    }
    setSales([newSale, ...sales])
    setIsDialogOpen(false)
  }

  const openAddDialog = () => {
    setViewingSale(null)
    setIsDialogOpen(true)
  }

  const openViewDialog = (sale: Sale) => {
    setViewingSale(sale)
    setIsDialogOpen(true)
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const todaySales = sales.filter((sale) => sale.date === new Date().toISOString().split("T")[0])
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
          <p className="text-muted-foreground">Registra y consulta las ventas realizadas</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{sales.length} transacciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{todaySales.length} transacciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sales.length > 0 ? (totalSales / sales.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Ticket promedio</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>Registro completo de transacciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No se encontraron ventas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">#{sale.id}</TableCell>
                      <TableCell>{new Date(sale.date).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{sale.items.length}</TableCell>
                      <TableCell className="font-medium">${sale.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sale.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openViewDialog(sale)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SaleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleAddSale} sale={viewingSale} />
    </div>
  )
}
