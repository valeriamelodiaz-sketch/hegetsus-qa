# 🧪 HE GETS US — Suite de Automatización de Pruebas E2E (QA)

Este repositorio contiene una suite profesional de automatización de pruebas E2E (de extremo a extremo) diseñada con **Playwright** y **TypeScript** para auditar, detectar y reportar fallos interactivos y visuales en el sitio web de desarrollo [He Gets Us](https://dev-site.hegetsus.com).

---

## 🛠️ Stack Tecnológico

- **Framework de Pruebas:** Playwright `^1.44.0`
- **Lenguaje de Programación:** TypeScript `^5.4.0`
- **Patrón de Diseño de Software:** Page Object Model (POM)
- **Reportes:** Playwright HTML Report + CLI List Reporter
- **Entorno de Ejecución:** Node.js v20+ / Windows / Linux / macOS (Totalmente preparado para pipelines de CI/CD)

---

## 🚀 Inicio Rápido e Instalación

Para levantar e inicializar la suite en tu máquina de desarrollo local, sigue estos pasos:

### 1. Requisitos Previos
Asegúrate de contar con [Node.js](https://nodejs.org/) (versión 18 o superior) y `npm` instalados en tu sistema operativo.

### 2. Instalación de Dependencias y Navegadores
Ejecuta los siguientes comandos en tu terminal para instalar las dependencias de node y descargar los binarios optimizados del navegador Chromium de Playwright:
```bash
npm install
npx playwright install chromium
```

### 3. Configuración de Variables de Entorno
Crea tu archivo de entorno local copiando la plantilla base:
```bash
cp .env.example .env
```
*(Asegúrate de que la variable `BASE_URL` en el archivo `.env` apunte a `https://dev-site.hegetsus.com`)*.

---

## 📊 Ejecución de las Pruebas Automatizadas

La suite cuenta con un total de **20 pruebas automatizadas** diseñadas bajo estándares de QA técnico para detectar **6 bugs críticos**. Utiliza los siguientes comandos preconfigurados de `npm` para ejecutar las pruebas según tu necesidad:

| Comando de Consola | Descripción de la Ejecución | Ruta del Sitio Evaluada |
|---|---|---|
| `npm run test` | Ejecuta la suite de 20 pruebas en segundo plano (Modo Headless) | Suite Completa |
| `npm run test:headed` | Ejecuta las pruebas abriendo el navegador en tiempo real (Modo Visual) | Suite Completa |
| `npm run test:bug01` | Evalúa el carrusel de exploración (Superposición de texto) | `/explore?journey=be` |
| `npm run test:bug02` | Audita la interactividad de botones del pie de página | Página de Inicio (`/`) |
| `npm run test:bug03` | Valida el correcto formato y comportamiento de enlaces mailto | Página de Inicio (`/`) |
| `npm run test:bug04` | Analiza el cargamiento de videos e imágenes rotas en la Sección 4 | `/explore?journey=be` |
| `npm run test:bug05` | Evalúa la lógica invertida del mapa y filtros semanales | Mapa de Eventos (`/articles`) |
| `npm run test:bug06` | Comprueba el bloqueo y funcionamiento del filtro de idiomas | Mapa de Eventos (`/articles`) |
| `npm run test:all-bugs` | Fuerza la corrida completa obligando la generación del reporte HTML | Suite Completa |

---

## 📂 Documentación del Proyecto

Hemos estructurado la documentación técnica detallada en español para que los desarrolladores y el equipo de producto puedan entender los defectos y replicar el proceso de automatización:

1.  **[Reporte Detallado de Bugs (docs/BUGS_REPORT.md)](file:///C:/projects/test-senior-qa/hegetsus-qa/docs/BUGS_REPORT.md):** Contiene la descripción exacta de los 6 bugs críticos detectados, pasos para reproducirlos en el navegador, selectores del DOM colisionados y evidencias visuales.
2.  **[Análisis de las 20 Pruebas y Escenarios Gherkin (docs/ANALISIS_DE_PRUEBAS.md)](file:///C:/projects/test-senior-qa/hegetsus-qa/docs/ANALISIS_DE_PRUEBAS.md):** Explica detalladamente de qué trata cada una de las 20 pruebas, **por qué 15 pruebas fallan debido a la presencia de fallos reales de desarrollo**, y define escenarios formales en formato BDD (Gherkin/Cucumber) en español.
3.  **[Manual de Decisiones Técnicas y Arquitectura (docs/TECHNICAL_DECISIONS.md)](file:///C:/projects/test-senior-qa/hegetsus-qa/docs/TECHNICAL_DECISIONS.md):** Justifica técnicamente la selección de Playwright por encima de Selenium, Cypress y Puppeteer, detalla el patrón Page Object Model (POM), y explica la estrategia de aserciones.
4.  **[Guía de Proceso Reutilizable y Operaciones (docs/REUSABLE_PROCESS.md)](file:///C:/projects/test-senior-qa/hegetsus-qa/docs/REUSABLE_PROCESS.md):** Manual técnico para incorporar nuevos programadores al equipo de QA, con convenciones de nomenclatura y flujos de diagnóstico de fallos inesperados.

---

## 📈 ¿Cómo Visualizar e Inicializar el Reporte de Pruebas?

Playwright captura de manera automática capturas de pantalla de evidencia (screenshots), videos de navegación y trazas de red. Tienes dos formas de auditar y abrir este reporte interactivo en tu navegador local:

### Opción A: Inicializar el Reporte mediante el comando CLI (Recomendado)
Para levantar el servidor web interactivo local y navegar por los resultados visuales detallados de cada una de las 20 pruebas, ejecuta en tu terminal:
```bash
npm run test:report
```
*Este comando inicializará un servidor web local (generalmente en `http://localhost:9323`) y abrirá de forma automática tu navegador web predeterminado mostrando la suite interactiva.*

### Opción B: Abrir directamente el archivo de reporte actual
Si prefieres no inicializar el servidor web o necesitas abrir de forma estática el reporte ya generado que se encuentra en el repositorio (el cual ha sido extraído del `.gitignore` para subirse al control de versiones):

1.  Navega físicamente a la carpeta `hegetsus-qa/playwright-report/` en tu gestor de archivos.
2.  Busca el archivo principal llamado `index.html`.
3.  Haz doble clic en `index.html` o haz clic derecho y selecciona **"Abrir con..."** eligiendo tu navegador web preferido (Google Chrome, Microsoft Edge, Firefox, etc.).
4.  *Nota técnica: Dado que algunos navegadores restringen la carga de archivos locales tipo iframe (CORS local) al abrir archivos HTML directamente desde el disco duro, si no se despliegan de forma interactiva las capturas de pantalla incrustadas al hacer clic en los detalles, inicializa el servidor interactivo usando `npm run test:report`.*

---

## 👥 Resumen del Estado Esperado de las Pruebas

Para mayor claridad del equipo de QA, a continuación se muestra la correspondencia entre los archivos de especificación, su estado de ejecución y su severidad técnica:

| ID del Defecto | Archivo de Especificación (`.spec.ts`) | Severidad | Estado del Test en la Suite | Razón de Estado |
|---|---|---|---|---|
| **BUG-01** | `bug01-explore-text-overlap.spec.ts` | **Media** | **ÉXITO (PASS)** | El test confirma matemáticamente la superposición física de los textos en pantalla. |
| **BUG-02** | `bug02-footer-buttons.spec.ts` | **Alta** | **FALLO (FAIL)** | Confirmación funcional de que los botones en el Footer no despliegan ningún modal en pantalla. |
| **BUG-03** | `bug03-footer-broken-links.spec.ts` | **Media** | **ÉXITO (PASS)** | Verifica que las URLs mailto del pie de página mantengan una sintaxis de enlace válida en HTML. |
| **BUG-04** | `bug04-video-load-failures.spec.ts` | **Alta** | **FALLO (FAIL)** | Confirma que los videos e imágenes de la Sección 4 se encuentran rotos o vacíos en el servidor. |
| **BUG-05** | `bug05-map-filter-logic.spec.ts` | **Crítica** | **FALLO (FAIL)** | Demuestra la inversión en los filtros de ubicación (In Person/Online) y el bloqueo del calendario semanal. |
| **BUG-06** | `bug06-map-language-filter.spec.ts` | **Alta** | **FALLO (FAIL)** | Confirma que al hacer clic sobre un idioma, el filtro de idioma no realiza ninguna acción en el mapa. |
