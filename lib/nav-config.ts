import type React from "react"
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Calculator } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Ventas",
    href: "/dashboard/sales",
    icon: ShoppingCart,
  },
  {
    title: "Cotización",
    href: "/dashboard/quotations",
    icon: FileText,
  },
  {
    title: "Arqueo de Caja",
    href: "/dashboard/cash-audit",
    icon: Calculator,
  },
  {
    title: "Clientes",
    href: "/dashboard/customers",
    icon: Users,
  },
]
