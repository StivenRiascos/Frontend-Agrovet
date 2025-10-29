"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Banknote } from "lucide-react"
import type { CashAudit } from "@/app/dashboard/cash-audit/page"
import { Badge } from "@/components/ui/badge"

type CashAuditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (audit: Omit<CashAudit, "id">) => void
  audit?: CashAudit | null
}

type DocumentItem = {
  concept: string
  value: number
}

export function CashAuditDialog({ open, onOpenChange, onSave, audit }: CashAuditDialogProps) {
  const [employeeName, setEmployeeName] = useState("")
  const [initialBalance, setInitialBalance] = useState(0)
  const [bills, setBills] = useState<{ [key: string]: number }>({
    "100000": 0,
    "50000": 0,
    "20000": 0,
    "10000": 0,
    "5000": 0,
    "2000": 0,
    "1000": 0,
  })
  const [coins, setCoins] = useState<{ [key: string]: number }>({
    "1000": 0,
    "500": 0,
    "200": 0,
    "100": 0,
    "50": 0,
  })
  const [transfers, setTransfers] = useState(0)
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [newDocument, setNewDocument] = useState<DocumentItem>({ concept: "", value: 0 })

  const isViewMode = !!audit

  useEffect(() => {
    if (audit) {
      setEmployeeName(audit.employeeName)
      setInitialBalance(audit.initialBalance)
      setBills(audit.cashCount.bills)
      setCoins(audit.cashCount.coins)
      setTransfers(audit.transfers)
      setDocuments(audit.documents)
    } else {
      setEmployeeName("")
      setInitialBalance(0)
      setBills({ "100000": 0, "50000": 0, "20000": 0, "10000": 0, "5000": 0, "2000": 0, "1000": 0 })
      setCoins({ "1000": 0, "500": 0, "200": 0, "100": 0, "50": 0 })
      setTransfers(0)
      setDocuments([])
      setNewDocument({ concept: "", value: 0 })
    }
  }, [audit, open])

  const calculateBillsTotal = () => {
    return Object.entries(bills).reduce((sum, [denomination, count]) => {
      return sum + Number.parseInt(denomination) * count
    }, 0)
  }

  const calculateCoinsTotal = () => {
    return Object.entries(coins).reduce((sum, [denomination, count]) => {
      return sum + Number.parseInt(denomination) * count
    }, 0)
  }

  const calculateDocumentsTotal = () => {
    return documents.reduce((sum, doc) => sum + doc.value, 0)
  }

  const calculateTotalCash = () => {
    return calculateBillsTotal() + calculateCoinsTotal()
  }

  const calculateActualTotal = () => {
    return calculateTotalCash() + transfers
  }

  const calculateDifference = () => {
    const expected = initialBalance
    const actual = calculateActualTotal()
    return actual - expected
  }

  const getStatus = (): "Cuadrada" | "Faltante" | "Sobrante" => {
    const diff = calculateDifference()
    if (diff === 0) return "Cuadrada"
    if (diff < 0) return "Faltante"
    return "Sobrante"
  }

  const handleAddDocument = () => {
    if (newDocument.concept && newDocument.value > 0) {
      setDocuments([...documents, newDocument])
      setNewDocument({ concept: "", value: 0 })
    }
  }

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const auditData = {
      date: new Date().toISOString().split("T")[0],
      employeeName,
      initialBalance,
      cashCount: { bills, coins },
      totalCash: calculateTotalCash(),
      transfers,
      documents,
      expectedTotal: initialBalance,
      actualTotal: calculateActualTotal(),
      difference: calculateDifference(),
      status: getStatus(),
    }

    onSave(auditData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{isViewMode ? "Arqueo de Caja" : "Nuevo Arqueo de Caja"}</DialogTitle>
              <p className="text-sm text-muted-foreground">AGRO INSUMOS EL CAMPO</p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Encargado de Caja</Label>
                <Input
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Nombre del empleado"
                  required
                  disabled={isViewMode}
                  className="cursor-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialBalance">Saldo Inicial</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                  disabled={isViewMode}
                  className="cursor-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Billetes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.keys(bills).map((denomination) => (
                    <div key={denomination} className="grid grid-cols-2 gap-2 items-center">
                      <Label className="text-sm">${Number.parseInt(denomination).toLocaleString()}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={bills[denomination]}
                        onChange={(e) => setBills({ ...bills, [denomination]: Number.parseInt(e.target.value) || 0 })}
                        disabled={isViewMode}
                        className="h-8 cursor-text"
                      />
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Total Billetes: ${calculateBillsTotal().toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Monedas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.keys(coins).map((denomination) => (
                    <div key={denomination} className="grid grid-cols-2 gap-2 items-center">
                      <Label className="text-sm">${Number.parseInt(denomination).toLocaleString()}</Label>
                      <Input
                        type="number"
                        min="0"
                        value={coins[denomination]}
                        onChange={(e) => setCoins({ ...coins, [denomination]: Number.parseInt(e.target.value) || 0 })}
                        disabled={isViewMode}
                        className="h-8 cursor-text"
                      />
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">Total Monedas: ${calculateCoinsTotal().toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfers">Transferencias / Cheques</Label>
              <Input
                id="transfers"
                type="number"
                step="0.01"
                value={transfers}
                onChange={(e) => setTransfers(Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                disabled={isViewMode}
                className="cursor-text"
              />
            </div>

            {!isViewMode && (
              <div className="space-y-2">
                <Label>Agregar Documento/Venta</Label>
                <div className="grid grid-cols-[2fr_1fr_auto] gap-2">
                  <Input
                    placeholder="Concepto"
                    value={newDocument.concept}
                    onChange={(e) => setNewDocument({ ...newDocument, concept: e.target.value })}
                    className="cursor-text"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Valor"
                    min="0"
                    value={newDocument.value}
                    onChange={(e) => setNewDocument({ ...newDocument, value: Number.parseFloat(e.target.value) || 0 })}
                    className="cursor-text"
                  />
                  <Button type="button" size="icon" onClick={handleAddDocument} className="cursor-pointer">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Documentos / Ventas del Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{doc.concept}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">${doc.value.toFixed(2)}</span>
                          {!isViewMode && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveDocument(index)}
                              className="h-6 w-6 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">Total Documentos: ${calculateDocumentsTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Base de Caja:</span>
                  <span className="text-sm font-medium">${initialBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Efectivo Físico:</span>
                  <span className="text-sm font-medium">${calculateTotalCash().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Transferencias:</span>
                  <span className="text-sm font-medium">${transfers.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm font-semibold">Total Sistema:</span>
                  <span className="text-sm font-bold">${calculateActualTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-base font-semibold">Diferencia:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        calculateDifference() === 0
                          ? "text-green-600"
                          : calculateDifference() > 0
                            ? "text-blue-600"
                            : "text-red-600"
                      }`}
                    >
                      ${Math.abs(calculateDifference()).toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        getStatus() === "Cuadrada"
                          ? "default"
                          : getStatus() === "Sobrante"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {getStatus()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button type="submit" className="cursor-pointer">
                Guardar Arqueo
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
