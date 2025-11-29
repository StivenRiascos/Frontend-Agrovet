'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Customer } from '@/app/dashboard/customers/page'
import { Textarea } from '@/components/ui/textarea'

type CustomerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer | Omit<Customer, 'id'>) => void
  customer?: Customer | null
}

export function CustomerDialog({ open, onOpenChange, onSave, customer }: CustomerDialogProps) {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    tipo_documento_id: '',
    numero_documento: '',
    telefono: '',
    email: '',
    direccion: '',
    lista_precio_id: '',
  })

  // Cargar datos si es edición
  useEffect(() => {
    if (customer) {
      setFormData({
        nombre_completo: customer.nombre_completo,
        tipo_documento_id: String(customer.tipo_documento_id),
        numero_documento: customer.numero_documento,
        telefono: customer.telefono,
        email: customer.email,
        direccion: customer.direccion,
        lista_precio_id: String(customer.lista_precio_id),
      })
    } else {
      setFormData({
        nombre_completo: '',
        tipo_documento_id: '',
        numero_documento: '',
        telefono: '',
        email: '',
        direccion: '',
        lista_precio_id: '',
      })
    }
  }, [customer, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nombre_completo ||
      !formData.numero_documento ||
      !formData.telefono ||
      !formData.email
    ) {
      return
    }

    if (customer) {
      // Editar cliente existente
      onSave({
        ...customer,
        ...formData,
        tipo_documento_id: Number(formData.tipo_documento_id),
        lista_precio_id: Number(formData.lista_precio_id),
      })
    } else {
      // Crear nuevo
      onSave({
        ...formData,
        tipo_documento_id: Number(formData.tipo_documento_id),
        lista_precio_id: Number(formData.lista_precio_id),
      })
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar Cliente' : 'Agregar Cliente'}</DialogTitle>
          <DialogDescription>
            {customer
              ? 'Modifica los datos del cliente.'
              : 'Completa la información para crear un nuevo cliente.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo</Label>
              <Input
                id="nombre_completo"
                value={formData.nombre_completo}
                onChange={(e) => handleChange('nombre_completo', e.target.value)}
                required
              />
            </div>

            {/* Tipo documento */}
            <div className="space-y-2">
              <Label htmlFor="tipo_documento_id">Tipo Documento (ID)</Label>
              <Input
                id="tipo_documento_id"
                type="number"
                value={formData.tipo_documento_id}
                onChange={(e) => handleChange('tipo_documento_id', e.target.value)}
                required
              />
            </div>

            {/* Número documento */}
            <div className="space-y-2">
              <Label htmlFor="numero_documento">Número Documento</Label>
              <Input
                id="numero_documento"
                value={formData.numero_documento}
                onChange={(e) => handleChange('numero_documento', e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                required
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                id="direccion"
                rows={3}
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                required
              />
            </div>

            {/* Lista de precio */}
            <div className="space-y-2">
              <Label htmlFor="lista_precio_id">Lista de Precios (ID)</Label>
              <Input
                id="lista_precio_id"
                type="number"
                value={formData.lista_precio_id}
                onChange={(e) => handleChange('lista_precio_id', e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{customer ? 'Guardar Cambios' : 'Agregar Cliente'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
