'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Search, Pencil, Trash2, Mail, Phone } from 'lucide-react'
import { CustomerDialog } from '@/components/customer-dialog'
import { customerService } from '@/services/customerService'

// TIPOS
export type Customer = {
  id: number
  nombre_completo: string
  tipo_documento_id: number
  numero_documento: string
  telefono: string
  email: string
  direccion: string
  lista_precio_id: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  // CARGAR CLIENTES
  useEffect(() => {
    const load = async () => {
      try {
        const response = await customerService.getCustomers()

        // 🔥 Convertimos cliente_id → id
        const list = Array.isArray(response?.data)
          ? response.data.map((c: any) => ({
              ...c,
              id: c.cliente_id, // 👈 CORRECCIÓN CLAVE
            }))
          : []

        setCustomers(list)
      } catch (error) {
        console.error('Error cargando clientes:', error)
        setCustomers([]) // evitar undefined
      }
    }
    load()
  }, [])

  // ------------------------------
  // FILTRO DE BÚSQUEDA
  // ------------------------------
  const filteredCustomers = (customers || [])
    .filter((c) => c && typeof c === 'object' && c.nombre_completo)
    .filter((customer) =>
      `${customer.nombre_completo || ''} ${customer.email || ''} ${customer.telefono || ''} ${customer.direccion || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )

  // GUARDAR (crear o editar)
  const handleSave = async (data: any) => {
    if (editingCustomer) {
      await handleEditCustomer(data)
    } else {
      await handleAddCustomer(data)
    }
  }

  // CREAR CLIENTE
  const handleAddCustomer = async (data: Omit<Customer, 'id'>) => {
    try {
      const response = await customerService.createCustomer(data)

      // 🔥 Convertir cliente_id → id
      const newCustomer = {
        ...response.data,
        id: response.data.cliente_id,
      }

      setCustomers([...(customers || []), newCustomer])
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error creando cliente:', error)
    }
  }

  // EDITAR CLIENTE
  const handleEditCustomer = async (data: Customer) => {
    try {
      const response = await customerService.updateCustomer(String(data.id), data)

      const updated = {
        ...response.data,
        id: response.data.cliente_id,
      }

      setCustomers((customers || []).map((c) => (c.id === data.id ? updated : c)))

      setEditingCustomer(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error actualizando cliente:', error)
    }
  }

  // ELIMINAR CLIENTE
  const handleDeleteCustomer = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      await customerService.deleteCustomer(String(id))
      setCustomers((customers || []).filter((c) => c.id !== id))
    } catch (error) {
      console.error('Error eliminando cliente:', error)
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

      {/* BUSCADOR */}
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

          {/* TABLA */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer: Customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.nombre_completo}</TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer.email}</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer.telefono}</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{customer.direccion}</TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(customer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
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

      {/* MODAL */}
      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={editingCustomer}
        onSave={handleSave}
      />
    </div>
  )
}
