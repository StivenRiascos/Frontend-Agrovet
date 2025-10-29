"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Mail, Phone } from "lucide-react"
import { CustomerDialog } from "@/components/customer-dialog"
import { Badge } from "@/components/ui/badge"

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalPurchases: number
  lastPurchase: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+1 234 567 8900",
      address: "Calle Principal 123, Ciudad",
      totalPurchases: 5,
      lastPurchase: "2025-01-15",
    },
    {
      id: "2",
      name: "María González",
      email: "maria.gonzalez@email.com",
      phone: "+1 234 567 8901",
      address: "Avenida Central 456, Ciudad",
      totalPurchases: 3,
      lastPurchase: "2025-01-14",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  const handleAddCustomer = (customer: Omit<Customer, "id" | "totalPurchases" | "lastPurchase">) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      totalPurchases: 0,
      lastPurchase: "-",
    }
    setCustomers([...customers, newCustomer])
    setIsDialogOpen(false)
  }

  const handleEditCustomer = (customer: Customer) => {
    setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)))
    setEditingCustomer(null)
    setIsDialogOpen(false)
  }

  const handleDeleteCustomer = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      setCustomers(customers.filter((c) => c.id !== id))
    }
  }

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingCustomer(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">Gestiona la información de tus clientes</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">Clientes registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter((c) => c.totalPurchases > 0).length}</div>
            <p className="text-xs text-muted-foreground">Con compras realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.length > 0
                ? (customers.reduce((sum, c) => sum + c.totalPurchases, 0) / customers.length).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Compras por cliente</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directorio de Clientes</CardTitle>
          <CardDescription>Lista completa de clientes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Compras</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                      <TableCell>
                        <Badge variant={customer.totalPurchases > 0 ? "default" : "secondary"}>
                          {customer.totalPurchases}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.lastPurchase !== "-"
                          ? new Date(customer.lastPurchase).toLocaleDateString("es-ES")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
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

      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={editingCustomer ? handleEditCustomer : handleAddCustomer}
        customer={editingCustomer}
      />
    </div>
  )
}
