"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Pencil, Trash2, Barcode } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"

export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  unit: string
  barcode: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Fertilizante NPK",
      category: "Fertilizantes",
      price: 25.5,
      stock: 150,
      unit: "kg",
      barcode: "7891234567890",
    },
    {
      id: "2",
      name: "Alimento para Ganado",
      category: "Alimentos",
      price: 45.0,
      stock: 80,
      unit: "saco",
      barcode: "7891234567891",
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery),
  )

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts([...products, newProduct])
    setIsDialogOpen(false)
  }

  const handleEditProduct = (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)))
    setEditingProduct(null)
    setIsDialogOpen(false)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestiona el inventario de tu tienda</p>
        </div>
        <Button onClick={openAddDialog} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario</CardTitle>
          <CardDescription>Lista completa de productos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, categoría o código de barras..."
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
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.stock < 20 ? "text-destructive font-medium" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="cursor-pointer"
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

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
      />
    </div>
  )
}
