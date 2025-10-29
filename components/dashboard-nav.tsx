"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sprout, LogOut } from "lucide-react"
import { navItems } from "@/lib/nav-config"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear any auth tokens here if needed
    router.push("/")
  }

  return (
    <aside className="w-64 border-r bg-muted/40 p-6">
      <div className="flex items-center gap-2 mb-8">
        <Sprout className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Agrovet</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start cursor-pointer", isActive && "bg-secondary")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8">
        <Button variant="ghost" className="w-full justify-start text-destructive cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}
