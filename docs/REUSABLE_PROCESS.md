# 📘 QA Automation — HE GETS US | Proceso Reutilizable y Operación

¡Bienvenido al equipo de automatización de QA para **He Gets Us**! Este documento sirve como manual de integración (onboarding) y guía operativa completa. Sigue los procedimientos descritos a continuación para ejecutar pruebas, interpretar los reportes HTML y extender la suite de pruebas a medida que el sitio web crezca.

---

## 1. Propósito de este Documento

Esta guía operativa garantiza que cualquier ingeniero de QA, independientemente de su nivel de experiencia, pueda:
- Estandarizar la instalación del entorno de pruebas de manera local.
- Ejecutar la suite de pruebas bajo los parámetros correctos.
- Agregar nuevos escenarios de prueba robustos sin introducir inestabilidad ("flakiness").
- Depurar y mantener las pruebas existentes de manera ágil y ordenada a lo largo del tiempo.

---

## 2. Instalación y Configuración Inicial

Para configurar el entorno y ejecutar las pruebas localmente en tu sistema operativo, realiza los siguientes pasos en tu terminal:

### Paso 1: Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd hegetsus-qa
```

### Paso 2: Instalar Dependencias del Proyecto
Instala todas las dependencias declaradas en el archivo `package.json`:
```bash
npm install
```

### Paso 3: Instalar Binarios de Navegación de Playwright
Descarga los navegadores optimizados necesarios para la ejecución de pruebas:
```bash
npx playwright install chromium
```

### Paso 4: Configurar Variables de Entorno
Copia el archivo de plantilla `.env.example` para crear tu `.env` local:
```bash
cp .env.example .env
```
Asegúrate de verificar que el archivo `.env` contenga la variable de entorno `BASE_URL` apuntando al entorno de pruebas correcto (ej. `https://dev-site.hegetsus.com`).

---

## 3. Guía de Ejecución de Pruebas

La suite de pruebas soporta ejecuciones en segundo plano (headless) y con interfaz de navegador (headed), además de filtrados específicos para cada defecto reportado.

| Alcance de la Prueba | Comando en Modo Headless (Por defecto) | Comando en Modo Headed (Visual) |
|---|---|---|
| **Ejecutar Suite Completa** | `npm run test` | `npm run test:headed` |
| **BUG-01 (Superposición Texto)** | `npm run test:bug01` | `npx playwright test bug01 --headed` |
| **BUG-02 (Botones del Footer)** | `npm run test:bug02` | `npx playwright test bug02 --headed` |
| **BUG-03 (Enlaces Mailto)** | `npm run test:bug03` | `npx playwright test bug03 --headed` |
| **BUG-04 (Fallo Carga Videos)** | `npm run test:bug04` | `npx playwright test bug04 --headed` |
| **BUG-05 (Filtros del Mapa)** | `npm run test:bug05` | `npx playwright test bug05 --headed` |
| **BUG-06 (Filtro de Idioma)** | `npm run test:bug06` | `npx playwright test bug06 --headed` |
| **Generar Reporte HTML Completo**| `npm run test:all-bugs` | N/A |

*Consejo técnico: Puedes agregar `--project=chromium` al final de cualquier comando para limitar la ejecución de navegadores y acelerar el tiempo de respuesta local.*

---

## 4. Visualización y Lectura de Reportes

Al completar una corrida de pruebas, Playwright genera un reporte consolidado extremadamente detallado en formato HTML.

### Servidor del Reporte Interactivo HTML
Para levantar el servidor web local y explorar paso a paso las acciones, capturas de pantalla de evidencia y grabaciones de video de los fallos, ejecuta:
```bash
npm run test:report
```
Esto abrirá de manera automática tu navegador web en la dirección local `http://localhost:9323` (o el puerto disponible).

### Interpretación de Resultados del Test
- **Passed (Exitoso):** La funcionalidad bajo prueba se comportó exactamente como se esperaba o el test identificó con precisión matemática la presencia del bug de diseño (como en BUG-01).
- **Failed (Fallido):** Se introdujo una regresión de código o se confirmó el fallo funcional de un bug (como en los filtros del mapa), bloqueando el pipeline de despliegue.
- **Flaky (Inestable):** El escenario falló en el primer intento pero pasó tras un reintento automático. *Acción requerida: Verificar tiempos de espera en red u optimizar los desplazamientos de scroll interactivos.*

---

## 5. Lista de Pasos para Agregar Nuevas Pruebas

Sigue esta **Lista de 8 Pasos Obligatorios** para asegurar la calidad de cualquier nueva prueba añadida a la suite:

1. **Analizar Page Objects:** Revisa si la pantalla objeto de prueba ya cuenta con un Page Object asignado en `/pages`. Si es una página nueva, crea un archivo que extienda de `BasePage`.
2. **Definir Selectores Centralizados:** Declara tus selectores web utilizando métodos getter privados que retornen tipos `Locator` dentro de la clase Page Object. ¡Queda estrictamente prohibido escribir selectores hardcodeados en los archivos `.spec.ts`!
3. **Desarrollar Flujos de Acción:** Implementa funciones públicas asíncronas para orquestar las interacciones de los elementos de esa página (ej. `async interactuarConFiltro()`).
4. **Declarar Datos en Fixtures:** Si la prueba utiliza credenciales, textos de aserción fijos o retardos de scroll específicos, centralízalos en `fixtures/test-data.ts`.
5. **Crear Archivo Spec:** Crea un archivo de especificaciones dentro de `tests/` respetando el formato estándar de nombres `bugXX-descripcion-corta.spec.ts`.
6. **Integrar Clases Utilitarias:** Instancia las clases `ScreenshotHelper` y `ScrollHelper` pasándoles el identificador único de la prueba para generar evidencias limpias.
7. **Prueba y Validación Local:** Corre la prueba en modo interactivo (`--headed`). Confirma que las capturas de pantalla se almacenen correctamente en `test-results/screenshots/`.
8. **Documentar el Reporte:** Si se confirma una anomalía, añade el caso al archivo `docs/BUGS_REPORT.md` respetando la estructura tabular de severidad e impacto del negocio.

---

## 6. Convenciones de Nomenclatura del Proyecto

Mantener la uniformidad y legibilidad del código es prioritario. Aplica estas convenciones:

- **Estructura de Archivos:** Usa minúsculas y guiones medios (kebab-case) para archivos físicos de pruebas:
  - Clase Page Object: `pages/ArticlesMapPage.ts` (PascalCase para clases).
  - Archivo de prueba: `tests/bug05-map-filter-logic.spec.ts` (kebab-case para specs).
- **Descripciones de Test:** Escribe descripciones de pruebas en español sumamente explícitas sobre la acción y el resultado:
  - `test('debe actualizar la etiqueta al elegir un idioma', async () => ...)`
- **Métodos y Variables:** Usa camelCase con verbos de acción bien identificados:
  - `async openFiltersPanel()`
  - `async selectLanguage(lang: string)`
- **Etiquetas de Evidencia:** Utiliza nombres autodescriptivos en minúsculas para las capturas:
  - `await screenshotHelper.capture('despues-de-seleccionar-idioma')`

---

## 7. Flujo de Depuración ante Fallos Inesperados

Si una prueba falla por causas ajenas a un bug conocido de la aplicación, sigue este flujo lógico de diagnóstico:

```
                   ┌─────────────────────────────────┐
                   │    ¡La Prueba ha Fallado!       │
                   └────────────────┬────────────────┘
                                    │
                                    ▼
                   ┌─────────────────────────────────┐
                   │  Abrir Traza y Reporte HTML     │
                   └────────────────┬────────────────┘
                                    │
                                    ▼
                   ┌─────────────────────────────────┐
                   │ ¿El selector es visible/activo? │
                   └──────┬───────────────────┬──────┘
                          │ No                │ Sí
                          ▼                   ▼
          ┌────────────────────────┐  ┌────────────────────────┐
          │ ¿El elemento cambió    │  │ ¿Es por una animación  │
          │ de ID o clase dinámica?│  │ interactiva de scroll? │
          │ Usar XPaths estables o │  │ Ajustar retardos en    │
          │ atributos semánticos.  │  │ ScrollHelper.          │
          └────────────────────────┘  └────────────────────────┘
```

1. **Revisar trazas de Playwright:** Corre el comando con `--trace on` para analizar fotograma a fotograma la interacción del navegador web previo al error.
2. **Dimensiones de Viewport:** Ciertos elementos de la web de He Gets Us se ocultan en pantallas pequeñas (diseño responsivo). Asegúrate de forzar el viewport estándar de escritorio `{ width: 1440, height: 900 }` en la configuración de la prueba.
3. **Validación de Red:** Si scripts de terceros bloquean el estado `'networkidle'`, reemplázalo por una espera explícita al selector objetivo `waitForSelector()` para mitigar bloqueos.
4. **Evitar Clases Dinámicas de Next.js:** En frameworks como Next.js, clases automáticas como `.css-1x8a23` cambian en cada despliegue de desarrollo. Utiliza siempre atributos fijos del DOM (ej. `data-acsb-custom-trigger="true"`) o la estructura estricta de XPaths provistos.

---

## 8. Mantenimiento del Proyecto de QA

A medida que el código de la web de desarrollo se actualice, mantén la suite con estas prácticas profesionales:

### Modificaciones en el Diseño del Sitio
Si el equipo de frontend reescribe o desplaza un componente web, **únicamente** deberás modificar el locator o XPath afectado dentro de su respectivo Page Object. Esto solucionará de inmediato todas las pruebas asociadas de manera transparente, sin necesidad de alterar ningún archivo de especificación `.spec.ts`.

### Eliminación o Cierre de Pruebas de Bugs
Cuando un bug sea reparado de forma permanente y definitiva en producción:
1. Ajusta la aserción en el archivo `.spec.ts` para validar que el comportamiento **exitoso** ocurra (ej. cambiar a `expect(result.dialogOpened).toBe(true)`).
2. Cambia el estado del defecto en `docs/BUGS_REPORT.md` a `Cerrado (Closed)`.
3. Mantén activa la prueba dentro de la suite. Ahora funcionará como una **prueba de regresión permanente**, asegurando que el mismo fallo no vuelva a ser introducido en futuras actualizaciones de código.
