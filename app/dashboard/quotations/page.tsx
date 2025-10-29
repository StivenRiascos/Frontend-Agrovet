"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye, Printer } from "lucide-react"
import { QuotationDialog } from "@/components/quotation-dialog"
import { Badge } from "@/components/ui/badge"
import { PrintQuotation } from "@/components/print-quotation"

export type Quotation = {
  id: string
  date: string
  customerName: string
  customerAddress: string
  customerPhone: string
  customerDocument: string
  items: Array<{
    code: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: "Pendiente" | "Aprobada" | "Rechazada"
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "001",
      date: "2025-01-22",
      customerName: "Luz Mery Arevalo",
      customerAddress: "Minimercado Nogales Del Norte",
      customerPhone: "3001234567",
      customerDocument: "1234567890",
      items: [
        { code: "001", productName: "Fertilizante NPK", quantity: 2, price: 25.5 },
        { code: "002", productName: "Alimento para Ganado", quantity: 1, price: 45.0 },
      ],
      total: 96.0,
      status: "Pendiente",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null)
  const [printingQuotation, setPrintingQuotation] = useState<Quotation | null>(null)

  const filteredQuotations = quotations.filter(
    (quotation) =>
      quotation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddQuotation = (quotation: Omit<Quotation, "id">) => {
    const newQuotation = {
      ...quotation,
      id: (quotations.length + 1).toString().padStart(3, "0"),
    }
    setQuotations([newQuotation, ...quotations])
    setIsDialogOpen(false)
  }

  const openAddDialog = () => {
    setViewingQuotation(null)
    setIsDialogOpen(true)
  }

  const openViewDialog = (quotation: Quotation) => {
    setViewingQuotation(quotation)
    setIsDialogOpen(true)
  }

  const handlePrint = (quotation: Quotation) => {
    setPrintingQuotation(quotation)
  }

  const totalQuotations = quotations.length
  const pendingQuotations = quotations.filter((q) => q.status === "Pendiente").length
  const totalValue = quotations.reduce((sum, q) => sum + q.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cotizaciones</h1>
          <p className="text-muted-foreground">Gestiona cotizaciones para tus clientes</p>
        </div>
        <Button onClick={openAddDialog} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cotización
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cotizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuotations}</div>
            <p className="text-xs text-muted-foreground">Cotizaciones generadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingQuotations}</div>
            <p className="text-xs text-muted-foreground">Esperando respuesta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Suma de cotizaciones</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Cotizaciones</CardTitle>
          <CardDescription>Registro completo de cotizaciones generadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 cursor-text"
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
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No se encontraron cotizaciones
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">#{quotation.id}</TableCell>
                      <TableCell>{new Date(quotation.date).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>{quotation.customerName}</TableCell>
                      <TableCell>{quotation.items.length}</TableCell>
                      <TableCell className="font-medium">${quotation.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            quotation.status === "Aprobada"
                              ? "default"
                              : quotation.status === "Pendiente"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {quotation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openViewDialog(quotation)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrint(quotation)}
                            className="cursor-pointer"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <QuotationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddQuotation}
        quotation={viewingQuotation}
      />

      {printingQuotation && <PrintQuotation quotation={printingQuotation} onClose={() => setPrintingQuotation(null)} />}
    </div>
  )
}
