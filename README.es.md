# Librería de Componentes POC

Una **prueba de concepto** para construir una librería moderna de componentes UI usando React,
TypeScript y una arquitectura de monorepo. Este repositorio sirve como punto de partida
e implementación de referencia para crear tu propia librería de componentes.

## 🎯 Propósito

Este proyecto demuestra cómo:

- Construir componentes React reutilizables con TypeScript
- Configurar un monorepo con configuraciones compartidas
- Documentar componentes con Storybook en una app centralizada de documentación
- Publicar componentes en GitHub Packages (registro privado)
- Mantener calidad de código con ESLint y flujos de trabajo automatizados

## 📚 Documentación

### Guías
- [Arquitectura](./docs/es/arquitectura.md) - Arquitectura detallada y stack tecnológico
- [Guía de Configuración](./docs/es/guia-configuracion.md) - Instalación y configuración de desarrollo
- [Guía de Implementación](./docs/es/guia-implementacion.md) - Detalles de implementación paso a paso
- [Guía de Estilos](./docs/es/guia-estilos.md) - Módulos SCSS y patrones de estilos
- [Solución de Problemas](./docs/es/solucion-problemas.md) - Problemas comunes y soluciones
- [Contribución](./docs/es/contribucion.md) - Cómo contribuir a este proyecto

### Gestión de Proyecto
- [Hoja de Ruta del Proyecto](./docs/es/project/hoja-ruta.md) - Plan de implementación e hitos

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Iniciar desarrollo
pnpm storybook
```

## 📦 Componentes

### Componente Button (`@ChrisVelasco0312/poc-ui-button`)

Un componente de botón simple y personalizable con soporte para TypeScript.

**Características:**

- Variantes Primaria/Secundaria
- Definiciones completas de TypeScript
- Builds ESM y UMD
- Documentación centralizada en Storybook

**Uso:**

```tsx
import { Button } from "@ChrisVelasco0312/poc-ui-button";

<Button variant="primary" onClick={() => alert("¡Hola!")}>
  Haz clic aquí
</Button>;
```

## 📋 Mejores Prácticas Demostradas

1. **Separación de Responsabilidades**: Los componentes se enfocan en funcionalidad, la documentación en presentación
2. **Documentación Centralizada**: Todas las historias y guías en una ubicación mantenible
3. **Seguridad de Tipos**: Cobertura completa de TypeScript con archivos de declaración
4. **Calidad de Código**: ESLint con reglas de React y TypeScript
5. **Optimización de Build**: Builds ESM tree-shakeable con Vite
6. **Registro Privado**: Distribución segura de componentes vía GitHub Packages

## 🔗 Usar Esto Como Plantilla

Para crear tu propia librería de componentes basada en este POC:

1. **Fork/Clonar** este repositorio
2. **Reemplazar scope**: Buscar y reemplazar `@poc` con `@tu-scope`
3. **Actualizar URLs del repositorio** en archivos package.json
4. **Agregar tus componentes** siguiendo los patrones establecidos
5. **Actualizar documentación** en la app docs
6. **Configurar CI/CD** para publicación automatizada
7. **Personalizar Storybook** tema y documentación

## 📖 Documentación Relacionada

- [Guía de Configuración Detallada](./proof-of-concept.md) - Guía de implementación paso a paso
- [Plan de Ejecución](./execution-plan.md) - Lista de verificación de desarrollo estructurado

## 💡 Solución de Problemas

### ¿Hot-Reloading No Funciona en Storybook?

Si editas un componente en `packages/components/*` y no ves los cambios
reflejados automáticamente en la app `docs` de Storybook, es probable que Vite esté
resolviendo el código precompilado de la carpeta `dist` del componente en lugar de
su código fuente.

**La Solución:**

1.  **Crear alias del paquete a su fuente:** En `apps/docs/.storybook/main.ts`, usa
    la función `viteFinal` para crear un alias de resolución que apunte el nombre del paquete
    del componente a su archivo fuente `index.ts`. Esto fuerza a Vite a observar los archivos
    fuente.

        ```ts
        // apps/docs/.storybook/main.ts
        async viteFinal(config) {
          const { mergeConfig } = await import('vite');
          return mergeConfig(config, {
            resolve: {
              alias: {
                '@ChrisVelasco0312/poc-ui-button': path.resolve(
                  __dirname,
                  '../../../packages/components/button/src/index.ts'
                ),
              },
            },
          });
        },
        ```

2.  **Asegurar que `vite` sea una dependencia:** La app `docs` necesita `vite` en sus
    `devDependencies` para usar `mergeConfig`.
3.  **Remover importaciones CSS incorrectas:** Asegurar que `apps/docs/.storybook/preview.ts`
    **no** importe ningún archivo CSS de paquetes de componentes (ej.,
    `@ChrisVelasco0312/poc-ui-button/dist/button.css`). Los componentes son responsables de importar sus
    propios estilos directamente en su archivo `index.ts`.

## 🤝 Contribución

Este es un repositorio de prueba de concepto. Siéntete libre de:

- Hacer fork y adaptar para tus necesidades
- Reportar problemas con el proceso de configuración
- Sugerir mejoras a la arquitectura

## 📄 Licencia

Licencia ISC - Siéntete libre de usar esto como base para tus propios proyectos.

---

**Nota**: Esta es una prueba de concepto diseñada para aprender y como punto de
partida. Para uso en producción, considera herramientas adicionales como pruebas automatizadas,
changesets para versionado y pipelines de CI/CD. 