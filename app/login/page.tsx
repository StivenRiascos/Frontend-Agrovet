'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Sprout } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ⚠️ NestJS espera "username" y "password" (no "email")
        body: JSON.stringify({ nombre_usuario: email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Credenciales incorrectas')
      }

      // Guardamos el token en localStorage para futuras peticiones
      localStorage.setItem('token', data.access_token)

      // Redirige al dashboard
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="text-2xl text-emerald-900">Iniciar Sesión</CardTitle>
            <CardDescription className="text-emerald-700">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-emerald-900 font-medium cursor-pointer">
                  Usuario o Correo
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="tu_usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="cursor-text border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {error && <p className="text-red-600 text-center">{error}</p>}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
              <p className="text-sm text-emerald-700 text-center">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/register"
                  className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline cursor-pointer"
                >
                  Regístrate aquí
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
