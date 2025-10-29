import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sprout } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Sprout className="h-16 w-16 text-primary" />
          <h1 className="text-5xl font-bold text-foreground">Agrovet</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Sistema de administración para tu tienda agropecuaria
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
