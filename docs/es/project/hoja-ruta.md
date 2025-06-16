# Librería de Componentes POC - Plan de Ejecución

## Resumen
Este plan describe la ejecución paso a paso de una librería de componentes de prueba de concepto usando:
- **Monorepo**: pnpm workspaces + Turborepo
- **Scope**: `@poc` (paquetes privados)
- **Componentes**: Componentes React con TypeScript
- **Documentación**: Storybook
- **Publicación**: GitHub Packages (registro privado)

---

## Lista de Verificación de Prerrequisitos
- [ ] Node.js (v18+) instalado
- [ ] pnpm instalado (`npm install -g pnpm`)
- [ ] Git instalado
- [ ] Cuenta de GitHub creada
- [ ] Editor de código (VS Code recomendado)

---

## Fase 1: Configuración de Base del Monorepo

### 1.1 Inicialización del Proyecto
```bash
# Crear e inicializar proyecto
mkdir poc-component-library
cd poc-component-library
git init
pnpm init
mkdir -p packages apps
```

### 1.2 Configuración de Workspace
- [ ] Crear `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'packages/config/*'
```

### 1.3 Configuración de Turborepo
```bash
# Instalar Turborepo
pnpm add -D -w turborepo
```
- [ ] Crear `turbo.json` con configuración de pipeline de build

### 1.4 Configuraciones Compartidas
- [ ] Crear estructura de directorio `packages/config/tsconfig/`
- [ ] Configurar paquete `@poc/tsconfig` con `react-library.json`
- [ ] Crear `tsconfig.json` raíz para soporte de VS Code

**Estructura Esperada Después de la Fase 1:**
```
poc-component-library/
├── packages/
│   └── config/
│       └── tsconfig/
├── apps/
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── package.json
```

---

## Fase 2: Desarrollo del Primer Componente

### 2.1 Creación del Paquete Button
```bash
# Crear paquete del componente button
mkdir -p packages/components/button/src
cd packages/components/button
pnpm init
```

### 2.2 Configuración del Paquete
- [ ] Configurar `package.json` con:
  - Nombre: `@poc/button`
  - Exportaciones y puntos de entrada apropiados
  - Scripts de build y dependencias
- [ ] Instalar dependencias:
```bash
pnpm add react --save-peer
pnpm add -D typescript vite @vitejs/plugin-react vite-plugin-dts @poc/tsconfig
```

### 2.3 Configuración de Build
- [ ] Crear `tsconfig.json` extendiendo `@poc/tsconfig`
- [ ] Crear `vite.config.ts` para empaquetado de librería

### 2.4 Desarrollo del Componente
- [ ] Crear `src/Button.tsx` con interfaz TypeScript
- [ ] Crear `src/index.ts` como punto de entrada
- [ ] Probar build: `pnpm turbo build --filter=@poc/button`

**Estructura Esperada Después de la Fase 2:**
```
packages/components/button/
├── src/
│   ├── Button.tsx
│   └── index.ts
├── dist/ (después del build)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Fase 3: Documentación con Storybook

### 3.1 Configuración de Storybook
```bash
# Crear app docs
mkdir apps/docs
cd apps/docs
npx storybook@latest init
```

### 3.2 Configuración de Storybook
- [ ] Configurar `apps/docs/.storybook/main.ts` para encontrar historias de componentes
- [ ] Actualizar ruta de historias a: `../../../packages/components/**/*.stories.@(js|jsx|mjs|ts|tsx)`

### 3.3 Creación de Historias
- [ ] Crear `packages/components/button/src/Button.stories.tsx`
- [ ] Configurar historia con variantes Primary y Secondary
- [ ] Probar: `pnpm turbo dev --filter=docs`

**Resultado Esperado:** Storybook ejecutándose en `http://localhost:6006` con documentación del componente Button

---

## Fase 4: Configuración de Publicación en GitHub

### 4.1 Configuración de Registro
- [ ] Crear `.npmrc` raíz:
```
@poc:registry=https://npm.pkg.github.com/
```

### 4.2 Configuración de Publicación del Paquete
- [ ] Actualizar `packages/components/button/package.json` con:
  - URL del repositorio
  - Configuración de publicación para GitHub Packages

### 4.3 Configuración del Repositorio GitHub
- [ ] Crear repositorio GitHub: `poc-component-library`
- [ ] Generar Personal Access Token (PAT) con scope `write:packages`
- [ ] Almacenar PAT de forma segura

---

## Fase 5: Publicación del Paquete

### 5.1 Versión y Commit
```bash
# Commit del trabajo inicial
git remote add origin https://github.com/[username]/poc-component-library.git
git add .
git commit -m "feat: configuración inicial del proyecto y componente button"
```

### 5.2 Proceso de Publicación
- [ ] Actualizar versión del paquete button a `0.0.1`
- [ ] Establecer variable de entorno: `export NPM_TOKEN=ghp_xxxxx`
- [ ] Publicar: `pnpm publish --filter @poc/button`
- [ ] Verificar que el paquete aparece en GitHub Packages

---

## Fase 6: Prueba de Consumo del Paquete

### 6.1 Configuración de Aplicación de Prueba
```bash
# Crear app de prueba separada
cd ..
npx create-next-app@latest test-consumer-app --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd test-consumer-app
```

### 6.2 Instalación de Paquete Privado
- [ ] Crear `.npmrc` con token de auth
- [ ] Instalar paquete: `pnpm add @poc/button`

### 6.3 Prueba de Integración
- [ ] Importar y usar `@poc/button` en página Next.js
- [ ] Probar funcionalidad: `pnpm dev`
- [ ] Verificar que los botones funcionan en `http://localhost:3000`

---

## Criterios de Éxito
- [ ] Estructura de monorepo con configuraciones compartidas
- [ ] Componente Button se construye exitosamente
- [ ] Documentación Storybook muestra el componente
- [ ] Paquete se publica en GitHub Packages
- [ ] App externa puede instalar y usar el paquete privado
- [ ] Ciclo completo desarrollo-a-consumo funciona

---

## Próximos Pasos (Post-POC)
1. **Agregar Componente Input**: Repetir Fase 2 para un componente Input
2. **Automatización**: Implementar Changesets para versionado automatizado
3. **CI/CD**: Configurar GitHub Actions para publicación automatizada
4. **Pruebas**: Agregar pruebas unitarias con Jest/Vitest
5. **Estilos**: Integrar CSS-in-JS apropiado o configuración Tailwind

---

## Notas
- Reemplazar `[username]` con nombre de usuario real de GitHub
- Almacenar NPM_TOKEN de forma segura (variable de entorno, no en archivos)
- Todos los paquetes `@poc` serán privados por defecto
- Storybook puede mostrar advertencias de Tailwind (esperado sin configuración CSS apropiada) 