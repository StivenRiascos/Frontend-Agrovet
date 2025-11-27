'use client'

import { useEffect, useState } from 'react'
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
import { Plus, Search, Pencil, Trash2, Barcode } from 'lucide-react'
import { ProductDialog } from '@/components/product-dialog'
import { productService } from '@/services/productService'

export type Product = {
  id: number | string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  barcode: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getProducts()

        const mapped = data.map((p: any) => ({
          id: Number(p.producto_id),
          name: p.nombre ?? 'Sin nombre',
          category: p.categoria ?? 'Sin categoría',
          price: Number(p.precio_costo_unitario ?? 0),
          stock: Number(p.stock_actual ?? 0),
          unit: p.unidad_medida ?? 'N/A',
          barcode: p.codigo_barras ?? '—',
        }))

        console.log('✅ Productos cargados:', mapped)
        setProducts(mapped)
      } catch (error) {
        console.error('Error cargando productos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // -------------------------------
  // ➤ CREAR PRODUCTO
  // -------------------------------
  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    console.log('🟩 GUARDAR NUEVO PRODUCTO (frontend):', product)

    try {
      const payload = {
        codigo_barras: product.barcode,
        nombre: product.name,
        descripcion: '',
        tipo_item_id: 1,
        categoria_id: 1,
        proveedor_id_preferido: null,
        precio_costo_unitario: Number(product.price),
        unidad_medida: product.unit,
        registro_ica: '',
        stock_actual: Number(product.stock),
        stock_minimo: 10,
      }

      console.log('📤 PAYLOAD (CREATE):', payload)

      const data = await productService.createProduct(payload)

      const newProduct: Product = {
        id: data?.producto_id ?? Math.floor(Math.random() * 1000000),
        name: product.name,
        category: 'General',
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        barcode: product.barcode,
      }

      console.log('📥 Nuevo producto creado (frontend):', newProduct)

      setProducts((prev) => [...prev, newProduct])
      setIsDialogOpen(false)
    } catch (error) {
      console.error('❌ ERROR creando producto:', error)
      alert('No se pudo crear el producto')
    }
  }

  // -------------------------------
  // ➤ EDITAR PRODUCTO
  // -------------------------------
  const handleEditProduct = async (product: Product) => {
    console.log('🟦 EDITANDO producto (frontend):', product)

    try {
      const payload = {
        codigo_barras: product.barcode,
        nombre: product.name,
        precio_costo_unitario: Number(product.price),
        unidad_medida: product.unit,
        stock_actual: Number(product.stock),
      }

      console.log('📤 PAYLOAD (UPDATE):', payload)

      await productService.updateProduct(String(product.id), payload)

      setProducts((prev) => prev.map((p) => (p.id == product.id ? product : p)))

      setEditingProduct(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('❌ ERROR actualizando producto:', error)
      alert('No se pudo actualizar el producto')
    }
  }

  // -------------------------------
  // ➤ ELIMINAR PRODUCTO
  // -------------------------------
  const handleDeleteProduct = async (id: number | string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    console.log('🗑 Eliminando producto ID:', id)

    try {
      await productService.deleteProduct(Number(id))
      setProducts((prev) => prev.filter((p) => Number(p.id) !== Number(id)))
    } catch (error) {
      console.error('Error eliminando producto', error)
      alert('No se pudo eliminar el producto')
    }
  }

  const filteredProducts = products.filter((product) => {
    const name = product.name ?? ''
    const category = product.category ?? ''
    const barcode = product.barcode?.toString() ?? ''

    const query = searchQuery.toLowerCase()

    return (
      name.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query) ||
      barcode.includes(searchQuery)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestiona el inventario de tu tienda</p>
        </div>

        <Button
          onClick={() => {
            console.log('🟨 Abrir modal para AGREGAR producto')
            setEditingProduct(null)
            setIsDialogOpen(true)
          }}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
          <CardDescription>Lista completa de productos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 cursor-text"
              />
            </div>
          </div>

          <div className="rounded-md border">
            {loading ? (
              <p className="p-4 text-center">Cargando productos...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Código de Barras</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Barcode className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm">{product.barcode}</span>
                          </div>
                        </TableCell>

                        <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.unit}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                console.log('🟧 EDITAR producto:', product)
                                setEditingProduct(product)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
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
            )}
          </div>
        </CardContent>
      </Card>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
      />
    </div>
  )
}
