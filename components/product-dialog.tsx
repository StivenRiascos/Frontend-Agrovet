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
import { productService } from '@/services/productService'
import { useToast } from '@/components/ui/use-toast'

type ProductDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: any | null
  onSave?: (p: any) => void
}

// Función segura para evitar errores con .toString()
const safe = (v: any) => (v === null || v === undefined ? '' : String(v))

export function ProductDialog({ open, onOpenChange, product, onSave }: ProductDialogProps) {
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    codigo_barras: '',
    nombre: '',
    descripcion: '',
    tipo_item_id: '',
    categoria_id: '',
    proveedor_id_preferido: '',
    precio_costo_unitario: '',
    unidad_medida: '',
    registro_ica: '',
    stock_actual: '',
    stock_minimo: '',
  })

  // Catálogos
  const tiposItems = [
    { id: 1, nombre: 'Fertilizante' },
    { id: 2, nombre: 'Herbicida' },
    { id: 3, nombre: 'Concentrado' },
  ]

  const categorias = [
    { id: 1, nombre: 'Fertilizantes' },
    { id: 2, nombre: 'Plaguicidas' },
    { id: 3, nombre: 'Aseo Animal' },
  ]

  const proveedores = [
    { id: 1, nombre: 'Agroinsumos Putumayo' },
    { id: 2, nombre: 'CampoFert SAS' },
    { id: 3, nombre: 'AgroProveedor Colombia' },
  ]

  // -------------------------------
  //  CARGA DE DATOS AL EDITAR
  // -------------------------------
  useEffect(() => {
    if (product) {
      setFormData({
        codigo_barras: safe(product.barcode ?? product.codigo_barras),
        nombre: safe(product.name ?? product.nombre),
        descripcion: safe(product.descripcion),
        tipo_item_id: safe(product.tipo_item_id ?? product.tipo_item),
        categoria_id: safe(product.categoria_id),
        proveedor_id_preferido: safe(product.proveedor_id_preferido),
        precio_costo_unitario: safe(product.price ?? product.precio_costo_unitario),
        unidad_medida: safe(product.unit ?? product.unidad_medida),
        registro_ica: safe(product.registro_ica),
        stock_actual: safe(product.stock ?? product.stock_actual),
        stock_minimo: safe(product.stock_minimo),
      })
    } else {
      // crear nuevo
      setFormData({
        codigo_barras: Math.random().toString().slice(2, 15),
        nombre: '',
        descripcion: '',
        tipo_item_id: '',
        categoria_id: '',
        proveedor_id_preferido: '',
        precio_costo_unitario: '',
        unidad_medida: '',
        registro_ica: '',
        stock_actual: '',
        stock_minimo: '',
      })
    }
  }, [product, open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // -----------------------------------------
  //               SUBMIT
  // -----------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const dataEnviar = {
      codigo_barras: formData.codigo_barras,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipo_item_id: Number(formData.tipo_item_id),
      categoria_id: Number(formData.categoria_id),
      proveedor_id_preferido: Number(formData.proveedor_id_preferido),
      precio_costo_unitario: Number(formData.precio_costo_unitario),
      unidad_medida: formData.unidad_medida,
      registro_ica: formData.registro_ica,
      stock_actual: Number(formData.stock_actual),
      stock_minimo: Number(formData.stock_minimo),
    }

    try {
      // si es nuevo → crear
      if (!product) {
        const created = await productService.createProduct(dataEnviar)
        onSave?.(created)
        toast({ title: 'Producto agregado', description: 'Guardado correctamente.' })
      } else {
        // si existe → EDITAR
        const updated = await productService.updateProduct(product.id, dataEnviar)
        onSave?.({ id: product.id, ...dataEnviar })
        toast({ title: 'Producto actualizado', description: 'Cambios guardados.' })
      }

      onOpenChange(false)
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudo guardar el producto.',
        variant: 'destructive',
      })
    }
  }

  const generateBarcode = () => {
    setFormData((prev) => ({ ...prev, codigo_barras: Math.random().toString().slice(2, 15) }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
          <DialogDescription>Completa los datos del producto.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* CAMPOS */}
            <div>
              <Label>Nombre</Label>
              <Input
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Descripción</Label>
              <Input
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
              />
            </div>

            <div>
              <Label>Código de Barras</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.codigo_barras}
                  onChange={(e) => handleChange('codigo_barras', e.target.value)}
                  required
                />
                <Button type="button" variant="outline" onClick={generateBarcode}>
                  Generar
                </Button>
              </div>
            </div>

            {/* SELECTS */}
            <div>
              <Label>Tipo de Item</Label>
              <select
                className="border rounded p-2 w-full"
                value={formData.tipo_item_id}
                onChange={(e) => handleChange('tipo_item_id', e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {tiposItems.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Categoría</Label>
              <select
                className="border rounded p-2 w-full"
                value={formData.categoria_id}
                onChange={(e) => handleChange('categoria_id', e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Proveedor Preferido</Label>
              <select
                className="border rounded p-2 w-full"
                value={formData.proveedor_id_preferido}
                onChange={(e) => handleChange('proveedor_id_preferido', e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* CAMPOS NUMÉRICOS */}
            <div>
              <Label>Precio Costo Unitario</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.precio_costo_unitario}
                onChange={(e) => handleChange('precio_costo_unitario', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Unidad de Medida</Label>
              <Input
                value={formData.unidad_medida}
                onChange={(e) => handleChange('unidad_medida', e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Registro ICA</Label>
              <Input
                value={formData.registro_ica}
                onChange={(e) => handleChange('registro_ica', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock Actual</Label>
                <Input
                  type="number"
                  value={formData.stock_actual}
                  onChange={(e) => handleChange('stock_actual', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Stock Mínimo</Label>
                <Input
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => handleChange('stock_minimo', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{product ? 'Guardar Cambios' : 'Agregar Producto'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
