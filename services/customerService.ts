const API_URL = 'http://localhost:3001/api/clientes'

export const customerService = {
  // ----------------------------------------------------------------------------
  // GET CLIENTES
  // ----------------------------------------------------------------------------
  async getCustomers() {
    try {
      const res = await fetch(API_URL)

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al obtener clientes: ${errorText}`)
      }

      const data = await res.json()

      // 🔥 Convertimos cliente_id → id en todos los objetos
      return {
        data: Array.isArray(data)
          ? data.map((c: any) => ({
              ...c,
              id: c.cliente_id,
            }))
          : [],
      }
    } catch (error) {
      console.error('❌ Error cargando clientes:', error)
      throw error
    }
  },

  // ----------------------------------------------------------------------------
  // CREATE CLIENTE
  // ----------------------------------------------------------------------------
  async createCustomer(customerData: any) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al crear cliente: ${errorText}`)
      }

      const data = await res.json()

      // 🔥 Convertimos cliente_id → id
      return {
        data: {
          ...data,
          id: data.cliente_id,
        },
      }
    } catch (error) {
      console.error('❌ Error al guardar cliente:', error)
      throw error
    }
  },

  // ----------------------------------------------------------------------------
  // UPDATE CLIENTE
  // ----------------------------------------------------------------------------
  async updateCustomer(id: string, customerData: any) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al actualizar cliente: ${errorText}`)
      }

      const data = await res.json()

      return {
        data: {
          ...data,
          id: data.cliente_id,
        },
      }
    } catch (error) {
      console.error('❌ Error actualizando cliente:', error)
      throw error
    }
  },

  // ----------------------------------------------------------------------------
  // DELETE CLIENTE
  // ----------------------------------------------------------------------------
  async deleteCustomer(id: string) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al eliminar cliente: ${errorText}`)
      }

      // DELETE puede retornar vacío
      const contentLength = res.headers.get('content-length')

      if (res.status === 204 || !contentLength || contentLength === '0') {
        return { success: true }
      }

      return await res.json()
    } catch (error) {
      console.error('❌ Error eliminando cliente:', error)
      throw error
    }
  },
}
