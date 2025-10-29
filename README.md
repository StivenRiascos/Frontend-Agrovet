# Agrovet - Sistema de Administración

Sistema administrativo para gestión de tienda agropecuaria desarrollado con Next.js 16 y React 19.

## 🚀 Características

- **Autenticación**: Login y registro de usuarios
- **Dashboard**: Panel principal con estadísticas
- **Gestión de Productos**: CRUD completo con códigos de barras
- **Registro de Ventas**: Control de transacciones y ventas
- **Cotizaciones**: Generación e impresión de cotizaciones
- **Arqueo de Caja**: Control diario de efectivo
- **Gestión de Clientes**: Base de datos de clientes

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + shadcn/ui + Tailwind CSS v4
- **TypeScript**: Strict mode habilitado
- **Optimizaciones**: React Compiler, Turbopack

## 📦 Instalación

\`\`\`bash
# Instalar dependencias
pnpm install

# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start
\`\`\`

## 🏗️ Estructura del Proyecto

\`\`\`
├── app/                    # Rutas de Next.js (App Router)
│   ├── dashboard/         # Páginas del dashboard
│   ├── login/            # Página de login
│   └── register/         # Página de registro
├── components/            # Componentes React
│   ├── ui/               # Componentes primitivos (shadcn/ui)
│   └── *.tsx             # Componentes compuestos
├── lib/                   # Utilidades y configuraciones
│   ├── utils.ts          # Funciones helper
│   └── nav-config.ts     # Configuración de navegación
└── public/               # Archivos estáticos
\`\`\`

## 🎨 Convenciones de Código

- **Componentes UI**: Usar componentes de `components/ui/` para consistencia
- **Estilos**: Tailwind CSS con tokens de diseño personalizados
- **TypeScript**: Strict mode, sin `any` types
- **Formato**: Prettier configurado (ejecutar `pnpm format`)
- **Linting**: ESLint configurado (ejecutar `pnpm lint`)

## 📝 Scripts Disponibles

\`\`\`bash
pnpm dev          # Servidor de desarrollo con Turbopack
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Ejecutar ESLint
pnpm format       # Formatear código con Prettier
pnpm type-check   # Verificar tipos TypeScript
\`\`\`

## 🎯 Características Técnicas

- **React Compiler**: Optimizaciones automáticas de rendimiento
- **Turbopack**: Compilación ultra-rápida en desarrollo
- **TypeScript Strict**: Máxima seguridad de tipos
- **Responsive Design**: Diseño adaptable a todos los dispositivos
- **Print Optimization**: Estilos optimizados para impresión de facturas

## 🔒 Seguridad

- TypeScript strict mode habilitado
- ESLint configurado con reglas de seguridad
- Validación de formularios
- Sanitización de inputs

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
\`\`\`

```json file="" isHidden
