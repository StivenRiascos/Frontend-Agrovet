import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Productos",
      value: "0",
      description: "Productos en inventario",
      icon: Package,
    },
    {
      title: "Ventas del Mes",
      value: "$0",
      description: "Ingresos mensuales",
      icon: TrendingUp,
    },
    {
      title: "Ventas Hoy",
      value: "0",
      description: "Transacciones realizadas",
      icon: ShoppingCart,
    },
    {
      title: "Clientes",
      value: "0",
      description: "Clientes registrados",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de tu tienda agropecuaria</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas transacciones y movimientos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Bajo Stock</CardTitle>
            <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Todos los productos tienen stock suficiente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
