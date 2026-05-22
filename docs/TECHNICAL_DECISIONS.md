# 🛠️ QA Automation — HE GETS US | Decisiones Técnicas y Arquitectura

Este documento describe el diseño de la arquitectura, la justificación de las herramientas seleccionadas y las estrategias de automatización implementadas para construir la suite de pruebas E2E con Playwright para [He Gets Us](https://dev-site.hegetsus.com).

---

## 1. Stack Tecnológico Seleccionado

| Componente | Herramienta | Versión | Justificación Técnica |
|---|---|---|---|
| **Framework E2E** | Playwright | `^1.44.0` | Soporte nativo multi-navegador en paralelo, control programático de viewports, intercepción de red e inicio ultra veloz sin necesidad de drivers adicionales. |
| **Lenguaje** | TypeScript | `^5.4.0` | Tipado estricto en los Page Objects, lo cual previene errores ortográficos de selectores y fallos lógicos durante el tiempo de compilación. |
| **Entorno de Ejecución** | Node.js | v20+ | Entorno estándar de JavaScript/TypeScript con alto rendimiento y excelente integración en entornos de CI/CD modernos. |
| **Carga de Configuración** | Dotenv | `^16.4.0` | Carga limpia de variables de entorno mediante un archivo `.env` local, facilitando la alternancia entre entornos de desarrollo, QA y producción. |

---

## 2. ¿Por Qué Playwright Sobre Otras Alternativas?

El sitio web de desarrollo de [He Gets Us](https://dev-site.hegetsus.com) utiliza animaciones complejas basadas en scroll (GSAP ScrollTrigger), carga diferida (lazy loading) de imágenes/videos, e interactividad intensa con mapas reactivos de Next.js.

Playwright destaca sobre las demás herramientas para este tipo de aplicación por las siguientes razones:

### Playwright vs. Selenium
Selenium se basa en drivers intermedios (WebDriver) y carece de esperas automáticas nativas fiables. En una web con carga diferida activada por scroll progresivo, Selenium obligaría a escribir decenas de bucles repetitivos de espera explícita (`WebDriverWait`), haciendo que el código sea propenso a fallar aleatoriamente. Playwright se conecta directamente mediante protocolos de depuración del navegador (CDP), garantizando una sincronización milimétrica de eventos.

### Playwright vs. Cypress
Cypress se ejecuta dentro del ciclo de eventos del navegador, lo que restringe el control fuera del DOM de la página, dificulta el testeo en múltiples pestañas del navegador o la interacción con XPaths complejos y shadow DOMs dinámicos. Además, Cypress presenta problemas de rendimiento con interacciones que implican scrolls masivos y continuos, características clave de nuestro flujo "Explore". Playwright corre fuera del proceso del navegador y simula acciones físicas reales del usuario de forma nativa.

### Playwright vs. Puppeteer
Puppeteer está diseñado principalmente para Chromium y no ofrece un test runner integrado completo. Playwright es una suite de testing de extremo a extremo que proporciona motores para Chromium, WebKit (Safari) y Firefox de manera nativa con una única API y un runner robusto.

---

## 3. Arquitectura Page Object Model (POM)

Para garantizar la escalabilidad, modularidad y facilidad de mantenimiento de la suite de pruebas a largo plazo, hemos implementado el patrón de diseño **Page Object Model (POM)**:

```
                   ┌──────────────────────┐
                   │       BasePage       │  (Clase base abstracta de la página)
                   └──────────┬───────────┘
                              │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │   HomePage   │ │  ExplorePage │ │ArticlesMapPge│
     └──────────────┘ └──────────────┘ └──────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   FooterComponent    │  (Componente hijo reutilizable)
                  └──────────────────────┘
```

### Beneficios Clave de la Arquitectura Implementada
- **Única Fuente de Verdad:** Los selectores CSS/XPath y los flujos de interacción del usuario se definen exclusivamente dentro de cada Page Object. Si la estructura del sitio web cambia en el futuro, solo se edita un archivo.
- **Pruebas Desacopladas:** Los archivos de pruebas (`.spec.ts`) contienen exclusivamente **aserciones y flujos lógicos de negocio**, eliminando el ruido de selectores CSS complejos y esperas en el código de prueba.
- **Herencia y Reutilización:** La clase `BasePage` centraliza las funciones generales como la navegación inicial (`navigate`), validación de estado de página cargada (`waitForPageReady`) y wrappers de esperas de red.
- **Composición de Componentes:** El `FooterComponent` se comporta como una clase independiente instanciable en cualquier otra página, evitando la duplicidad de selectores comunes de navegación inferior.

---

## 4. Estrategia de Esperas (Evitando "Flakiness")

Los retardos de tiempo arbitrarios fijados de forma fija (`setTimeout` / `sleep`) son el principal enemigo de las suites de automatización. Hemos implementado un modelo de sincronización basado en estados:

1. **Auto-Waiting de Playwright:** Playwright espera automáticamente a que los elementos estén visibles, adjuntos al DOM, estables en el layout y sean interactivos antes de disparar acciones de click o tipeo.
2. **Espera a Red Inactiva (`waitForLoadState('networkidle')`):** Utilizada durante el cambio de páginas críticas (como `/explore` o `/articles`) para asegurar que todas las solicitudes API y assets se descarguen del servidor antes de iniciar la interacción.
3. **Espera de Carga Completa del DOM (`document.readyState === 'complete'`):** Orquestada de forma global en `BasePage.waitForPageReady()`.
4. **Retardos Visuales Controlados (`waitForTimeout`):** Utilizados únicamente cuando las animaciones del navegador activadas por scroll (GSAP) requieren un tiempo de renderizado físico para estabilizar el viewport antes de capturar screenshots de evidencia, simulando la velocidad física de interacción de un humano real.

---

## 5. Capturas de Pantalla y Evidencia Visual

Dado que la suite tiene el objetivo de documentar errores visuales complejos (como texto encabalgado o videos vacíos), se implementó una estrategia robusta de captura de evidencias:
- **Estructura Organizada:** Las capturas se guardan bajo el directorio `test-results/screenshots/{nombrePrueba}/{timestamp}-{etiqueta}.png`.
- **Limpieza de Nombres:** La clase `ScreenshotHelper` limpia y sanitiza automáticamente los caracteres no válidos de los nombres de prueba para compatibilidad en sistemas Linux/Windows.
- **Adjuntos Interactivos en Reportes:** Cada captura exitosa o de fallo se asocia de forma dinámica a la prueba mediante `test.info().attach()`, lo que permite visualizarlas en el reporte HTML interactivo de Playwright.

---

## 6. Principios de Selección de Elementos

Los selectores del DOM se definieron siguiendo el siguiente orden de prioridad:
1. **Selectores de Accesibilidad Semántica:** Se prefiere el uso de `getByRole` o `getByText` siempre que sea posible. Esto asegura que estemos testeando la plataforma del mismo modo en que la perciben los lectores de pantalla y usuarios finales.
2. **Selectores CSS Robustos:** Aplicados en el Footer y elementos estructurales donde se evalúan atributos técnicos explícitos (como `button[data-acsb-custom-trigger="true"]`).
3. **Selectores XPath Estrictos:** Usados de manera puntual en los filtros del mapa (`ArticlesMapPage`), asegurando el cumplimiento preciso de la ruta del DOM descrita en los requerimientos del proyecto de QA.

---

## 7. Filosofía en Aserciones de Bugs (Éxito vs Fallo)

En una suite de pruebas automatizadas de alta calidad que busca registrar fallos activos:
- **Pruebas de Defectos Físicos (PASS de Detección):** En escenarios como `bug01` (superposición de textos), el test implementa un algoritmo matemático que calcula colisiones en los rectángulos de los elementos. El test está diseñado para dar **PASS** al documentar de manera correcta la existencia física del bug.
- **Pruebas de Defecto Funcional (FAIL de Regresión):** En escenarios de comportamiento funcional ausente como `bug02` (botones que no abren modales) o `bug05`/`bug06` (filtros rotos/invertidos), el test realiza la aserción de lo que **debería ocurrir** (ej. esperar la visibilidad de un modal). El test de Playwright dará **FAIL** mientras el bug esté activo en el servidor. Esto es de vital importancia, ya que bloqueará el despliegue automático en la integración continua (CI/CD) hasta que desarrollo repare la funcionalidad.
- **Mensajes Descriptivos:** Todas las aserciones cuentan con textos descriptivos personalizados para que los desarrolladores identifiquen el error exacto de un vistazo en la consola.

---

## 8. Consideraciones para CI/CD (Integración Continua)

La suite de pruebas está preparada para incorporarse a flujos automatizados de despliegue:
- **Modo Headless:** Configurable en el archivo de variables `.env` o sobreescribible mediante parámetros de línea de comandos.
- **Reportes HTML Portables:** Generación de un reporte estático completo que puede ser publicado directamente como artefacto de compilación o visualizado de forma interactiva en la red local.
- **Ejecución en Un Solo Hilo:** Configurada con `workers: 1` para prevenir colisiones de red o bloqueos de renderizado de animaciones dinámicas al ejecutar múltiples instancias sobre el mismo dev-server de manera concurrente.
