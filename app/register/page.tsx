"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Sprout } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }
    console.log("[v0] Register attempt:", { name: formData.name, email: formData.email })
    window.location.href = "/dashboard"
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 p-4 rounded-2xl shadow-lg">
            <Sprout className="h-10 w-10 text-white" />
            <h1 className="text-3xl font-bold text-white">Agrovet</h1>
          </div>
          <p className="text-emerald-800 text-center font-medium">Sistema de Administración</p>
        </div>

        <Card className="shadow-2xl border-2 border-emerald-100">
          <CardHeader className="space-y-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
            <CardTitle className="text-2xl text-emerald-900">Crear Cuenta</CardTitle>
            <CardDescription className="text-emerald-700">
              Completa el formulario para registrarte en el sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-900 font-medium cursor-pointer">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="cursor-text border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-900 font-medium cursor-pointer">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="cursor-text border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-900 font-medium cursor-pointer">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="cursor-text border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-emerald-900 font-medium cursor-pointer">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  required
                  className="cursor-text border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Crear Cuenta
              </Button>
              <p className="text-sm text-emerald-700 text-center">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline cursor-pointer"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
