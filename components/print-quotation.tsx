"use client"

import { useEffect } from "react"
import type { Quotation } from "@/app/dashboard/quotations/page"

type PrintQuotationProps = {
  quotation: Quotation
  onClose: () => void
}

export function PrintQuotation({ quotation, onClose }: PrintQuotationProps) {
  useEffect(() => {
    // Auto print when component mounts
    const timer = setTimeout(() => {
      window.print()
      onClose()
    }, 500)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="print-only fixed inset-0 bg-white z-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-emerald-600 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-emerald-700">AGRO INSUMOS EL CAMPO</h1>
          <p className="text-sm text-gray-600 mt-1">EL ALIADO PARA TUS CULTIVOS</p>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Cliente:</p>
              <p className="text-lg font-bold">{quotation.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Fecha:</p>
              <p className="text-lg">{new Date(quotation.date).toLocaleDateString("es-ES")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Dirección:</p>
              <p>{quotation.customerAddress}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Teléfono:</p>
              <p>{quotation.customerPhone}</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold text-gray-700">Documento:</p>
            <p>{quotation.customerDocument}</p>
          </div>
        </div>

        {/* Products Table */}
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-emerald-600 text-white">
              <th className="border border-gray-300 p-2 text-left">Código</th>
              <th className="border border-gray-300 p-2 text-left">Producto</th>
              <th className="border border-gray-300 p-2 text-right">Precio</th>
              <th className="border border-gray-300 p-2 text-right">Cant.</th>
              <th className="border border-gray-300 p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{item.code}</td>
                <td className="border border-gray-300 p-2">{item.productName}</td>
                <td className="border border-gray-300 p-2 text-right">${item.price.toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg">
            <p className="text-sm">TOTAL</p>
            <p className="text-2xl font-bold">${quotation.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>Gracias por su preferencia</p>
          <p className="mt-1">Cotización #{quotation.id}</p>
        </div>
      </div>
    </div>
  )
}
