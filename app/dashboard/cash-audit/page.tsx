"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Eye } from "lucide-react"
import { CashAuditDialog } from "@/components/cash-audit-dialog"
import { Badge } from "@/components/ui/badge"

export type CashAudit = {
  id: string
  date: string
  employeeName: string
  initialBalance: number
  cashCount: {
    bills: { [key: string]: number }
    coins: { [key: string]: number }
  }
  totalCash: number
  transfers: number
  documents: Array<{
    concept: string
    value: number
  }>
  expectedTotal: number
  actualTotal: number
  difference: number
  status: "Cuadrada" | "Faltante" | "Sobrante"
}

export default function CashAuditPage() {
  const [audits, setAudits] = useState<CashAudit[]>([
    {
      id: "1",
      date: "2025-01-22",
      employeeName: "Tatiana Natib",
      initialBalance: 200000,
      cashCount: {
        bills: { "100000": 0, "50000": 0, "20000": 0, "10000": 0, "5000": 0, "2000": 0, "1000": 0 },
        coins: { "1000": 0, "500": 0, "200": 0, "100": 0, "50": 0 },
      },
      totalCash: 601000,
      transfers: 0,
      documents: [
        { concept: "AGRONEX LITRO", value: 22000 },
        { concept: "ALARM", value: 20000 },
        { concept: "INCIPIO", value: 80000 },
      ],
      expectedTotal: 200000,
      actualTotal: 601000,
      difference: 401000,
      status: "Sobrante",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingAudit, setViewingAudit] = useState<CashAudit | null>(null)

  const filteredAudits = audits.filter(
    (audit) =>
      audit.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddAudit = (audit: Omit<CashAudit, "id">) => {
    const newAudit = {
      ...audit,
      id: Date.now().toString(),
    }
    setAudits([newAudit, ...audits])
    setIsDialogOpen(false)
  }

  const openAddDialog = () => {
    setViewingAudit(null)
    setIsDialogOpen(true)
  }

  const openViewDialog = (audit: CashAudit) => {
    setViewingAudit(audit)
    setIsDialogOpen(true)
  }

  const totalAudits = audits.length
  const currentMonth = new Date().getMonth()
  const monthAudits = audits.filter((a) => new Date(a.date).getMonth() === currentMonth).length
  const totalDifferences = audits.reduce((sum, a) => sum + Math.abs(a.difference), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Arqueo de Caja</h1>
          <p className="text-muted-foreground">Registra y verifica el cierre de caja diario</p>
        </div>
        <Button onClick={openAddDialog} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Arqueo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Arqueos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAudits}</div>
            <p className="text-xs text-muted-foreground">Arqueos realizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Arqueos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{monthAudits}</div>
            <p className="text-xs text-muted-foreground">En el mes actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Diferencias Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">${totalDifferences.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Suma de diferencias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Arqueos</CardTitle>
          <CardDescription>Registro completo de arqueos de caja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por empleado o ID..."
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
                  <TableHead>Fecha</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Monto Esperado</TableHead>
                  <TableHead>Monto Real</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No se encontraron arqueos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAudits.map((audit) => (
                    <TableRow key={audit.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{new Date(audit.date).toLocaleDateString("es-ES")}</TableCell>
                      <TableCell>{audit.employeeName}</TableCell>
                      <TableCell>${audit.expectedTotal.toFixed(2)}</TableCell>
                      <TableCell>${audit.actualTotal.toFixed(2)}</TableCell>
                      <TableCell
                        className={
                          audit.difference === 0
                            ? "text-green-600 font-medium"
                            : audit.difference > 0
                              ? "text-blue-600 font-medium"
                              : "text-red-600 font-medium"
                        }
                      >
                        ${Math.abs(audit.difference).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            audit.status === "Cuadrada"
                              ? "default"
                              : audit.status === "Sobrante"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {audit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(audit)}
                          className="cursor-pointer"
                        >
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

      <CashAuditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddAudit}
        audit={viewingAudit}
      />
    </div>
  )
}
