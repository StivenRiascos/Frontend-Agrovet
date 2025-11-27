export const productService = {
  async getProducts() {
    try {
      const res = await fetch('http://localhost:3001/api/productos')

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al obtener productos: ${errorText}`)
      }

      return await res.json()
    } catch (error) {
      console.error('Error al cargar productos:', error)
      throw error
    }
  },

  async createProduct(productData: any) {
    try {
      const res = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al crear producto: ${errorText}`)
      }

      return await res.json()
    } catch (error) {
      console.error('Error al guardar:', error)
      throw error
    }
  },

  async updateProduct(id: string, productData: any) {
    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al actualizar producto: ${errorText}`)
      }

      return await res.json()
    } catch (error) {
      console.error('Error actualizando producto:', error)
      throw error
    }
  },

  // 🔥 NUEVO: eliminar producto
  async deleteProduct(id: string) {
    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al eliminar producto: ${errorText}`)
      }

      // Si no hay contenido, NO intentar hacer res.json()
      const contentLength = res.headers.get('content-length')

      if (res.status === 204 || contentLength === '0' || contentLength === null) {
        return { success: true }
      }

      // Si sí hay contenido, intentar leerlo como JSON
      return await res.json()
    } catch (error) {
      console.error('Error eliminando producto:', error)
      throw error
    }
  },
}
