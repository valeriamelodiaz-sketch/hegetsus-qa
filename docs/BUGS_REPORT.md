# 🧪 QA Automation — HE GETS US | Reporte de Bugs (Defectos)

Este documento detalla los fallos y comportamientos inesperados detectados de manera automática por la suite de pruebas E2E en el sitio web de desarrollo [He Gets Us](https://dev-site.hegetsus.com).

---

## BUG-01 — Flujo Explore: Superposición de texto en sección 5 (Journey "Be")

| Campo | Valor |
|---|---|
| **ID del Defecto** | BUG-01 |
| **Severidad** | Media |
| **Prioridad** | P2 |
| **Componente** | Página de Exploración (Flujo del Carrusel) |
| **Ruta Afectada** | `https://dev-site.hegetsus.com/explore?journey=be` |
| **Navegador** | Chrome 124+ / Firefox / WebKit |
| **Estado** | Abierto (Open) |

### Descripción
En el flujo interactivo del carrusel de exploración (para la jornada "Be"), al hacer scroll progresivo hasta la Sección 5, el texto de fondo estilo marca de agua en gran tamaño `"I can't do it all"` se superpone directamente con el párrafo de texto del primer plano `"His belief landed him in prison"`. Esto resulta en una superposición de caracteres que destruye la legibilidad de ambos textos y daña gravemente la presentación estética del sitio.

### Pasos para Reproducir
1. Navegar a la página de inicio (`/`).
2. Hacer clic en el botón "Explore" para abrir el flujo interactivo de carrusel.
3. Esperar la redirección a `/explore?journey=be`.
4. Realizar un scroll progresivo (paso a paso) hasta llegar a la Sección 5.
5. Observar el texto del viewport en la pantalla.

### Resultado Actual
Los cuadros de límites (bounding boxes) del texto de fondo y el párrafo principal del primer plano se intersecan físicamente en el DOM, mostrando letras encima de otras.

### Resultado Esperado
El texto estilo marca de agua de fondo debe permanecer estrictamente por detrás del contenido del primer plano (configurado adecuadamente con `z-index` y posicionamiento absoluto) o contar con el margen suficiente para evitar cualquier colisión visual con los párrafos informativos.

### Elemento / Selectores Afectados
```css
/* Textos colisionantes en el DOM */
section:nth-of-type(5) .watermark-text,
p:has-text("His belief landed him in prison")
```

### Evidencia Visual
* Ubicación de captura: `hegetsus-qa/test-results/screenshots/bug01_text_overlap/section-5-text-overlap.png`

### Impacto en el Usuario
Los usuarios que recorren el carrusel interactivo experimentarán una pérdida inmediata de legibilidad y usabilidad, restando profesionalismo y calidad al diseño del producto final.

---

## BUG-02 — Footer: Botones de Accesibilidad y Preferencias de Cookies no responden

| Campo | Valor |
|---|---|
| **ID del Defecto** | BUG-02 |
| **Severidad** | Alta |
| **Prioridad** | P1 |
| **Componente** | Footer (Pie de Página) |
| **Ruta Afectada** | `https://dev-site.hegetsus.com/` (y cualquier página con Footer) |
| **Navegador** | Chrome 124+ / Firefox / WebKit |
| **Estado** | Abierto (Open) |

### Descripción
Los botones **"Accessibility"** (Accesibilidad) y **"Cookie Preferences"** (Preferencias de Cookies) que se encuentran en el Footer no realizan ninguna acción ni despliegan ningún modal o panel interactivo al hacer clic sobre ellos.

### Pasos para Reproducir
1. Navegar a la página principal (`/`).
2. Hacer scroll completo hasta el componente Footer.
3. Hacer clic en el botón "Accessibility" (o en "Cookie Preferences").
4. Verificar si aparece en pantalla algún modal de control, widget o menú emergente.

### Resultado Actual
No se abre ningún modal ni panel de consentimiento de cookies o accesibilidad. La interfaz permanece inalterada y no se registran excepciones visibles en la consola de cara al usuario.

### Resultado Esperado
* Al hacer clic en "Accessibility", se debe inicializar el widget de accesibilidad (por ejemplo, el menú adaptativo de accesibilidad).
* Al hacer clic en "Cookie Preferences", se debe abrir el banner/panel de configuración de consentimiento de cookies (por ejemplo, OneTrust o el gestor de cookies integrado).

### Elemento / Selectores Afectados
```css
button[data-acsb-custom-trigger="true"]
button:has-text("Cookie Preferences")
```

### Evidencia Visual
* Ubicación de captura de Accesibilidad: `hegetsus-qa/test-results/screenshots/bug02_accessibility_click/accessibility-clicked.png`
* Ubicación de captura de Cookies: `hegetsus-qa/test-results/screenshots/bug02_cookie_click/cookie-preferences-clicked.png`

### Impacto en el Usuario
* **Accesibilidad:** Los usuarios con discapacidades no pueden utilizar los lectores de pantalla ni herramientas de contraste o accesibilidad personalizada.
* **Cookies:** Se vulneran las normativas legales de privacidad internacional (GDPR y CCPA) al no permitir a los usuarios gestionar o revocar sus consentimientos de cookies una vez aceptadas.

---

## BUG-03 — Footer: Enlaces Mailto de "Contact Us" y "Press Inquiries"

| Campo | Valor |
|---|---|
| **ID del Defecto** | BUG-03 |
| **Severidad** | Media |
| **Prioridad** | P2 |
| **Componente** | Footer (Pie de Página) |
| **Ruta Afectada** | `https://dev-site.hegetsus.com/` |
| **Navegador** | Todos los navegadores de escritorio y móviles |
| **Estado** | Abierto (Open) |

### Descripción
Los enlaces para **"Contact Us"** (Contacto) y **"Press Inquiries"** (Prensa) en el Footer están configurados como enlaces `mailto:`. Si bien esta sintaxis es correcta en HTML estándar, el flujo web no provee una alternativa directa o fallback para los usuarios que no tienen un cliente de correo electrónico nativo instalado y configurado en su sistema operativo.

### Pasos para Reproducir
1. Ir a la página de inicio y hacer scroll al Footer.
2. Identificar los enlaces "Contact Us" y "Press Inquiries".
3. Inspeccionar el atributo `href` en el DOM de ambos enlaces.

### Resultado Actual
Al hacer clic, el sistema intenta abrir un cliente de correo nativo local (ej. Microsoft Outlook, Apple Mail) con una experiencia nula si el usuario utiliza servicios de webmail exclusivos (como Gmail o Yahoo) sin aplicación de escritorio.
* Hrefs actuales:
  - `mailto:info@hegetsus.com`
  - `mailto:press@hegetsus.com`

### Resultado Esperado
Aunque el uso de `mailto:` es correcto desde el punto de vista estricto de HTML, se espera que para una experiencia de usuario (UX) moderna y accesible se implemente un formulario de contacto web en un modal, o en su defecto, una opción visual para copiar la dirección al portapapeles.

### Elemento / Selectores Afectados
```css
a[href="mailto:info@hegetsus.com"]
a[href="mailto:press@hegetsus.com"]
```

### Evidencia Visual
* Ubicación de captura: `hegetsus-qa/test-results/screenshots/bug03_mailto_navigation/mailto-clicked.png`

### Impacto en el Usuario
Los usuarios en dispositivos sin clientes nativos (como Chromebooks o computadoras compartidas) no pueden enviar correos electrónicos al hacer clic en los enlaces del Footer, interrumpiendo el flujo de comunicación.

---

## BUG-04 — Explore Journey BE: Fallo de Carga de Videos e Imágenes en Sección 4

| Campo | Valor |
|---|---|
| **ID del Defecto** | BUG-04 |
| **Severidad** | Alta |
| **Prioridad** | P1 |
| **Componente** | Página de Exploración (Sección 4 del Carrusel) |
| **Ruta Afectada** | `https://dev-site.hegetsus.com/explore?journey=be` |
| **Navegador** | Chrome 124+ / Firefox / WebKit |
| **Estado** | Abierto (Open) |

### Descripción
Al navegar en el carrusel de la jornada "Be" y realizar scroll progresivo hasta la Sección 4, múltiples recursos de video e imágenes fallan al descargarse o no cargan correctamente, dejando contenedores en color negro/vacíos y marcos de imagen rotos en el viewport.

### Pasos para Reproducir
1. Entrar directamente en `/explore?journey=be`.
2. Hacer scroll progresivo hacia abajo hasta llegar a la Sección 4.
3. Observar los reproductores de video y las imágenes renderizadas.

### Resultado Actual
Múltiples elementos `<video>` se quedan en estado de error de red `networkState === 3` (`NETWORK_NO_SOURCE`) y las imágenes `<img>` tienen un ancho natural de cero (`naturalWidth === 0`), lo cual indica enlaces rotos a los assets multimedia.

### Resultado Esperado
Todos los recursos de video (formatos mp4/webm) e imágenes (png/jpg) deben cargarse con éxito y reproducirse fluidamente al ingresar al viewport de la sección.

### Elemento / Selectores Afectados
```css
section:nth-of-type(4) video,
section:nth-of-type(4) img
```

### Evidencia Visual
* Captura de Videos Rotos: `hegetsus-qa/test-results/screenshots/bug04_videos_failure/section-4-videos.png`
* Captura de Imágenes Rotas: `hegetsus-qa/test-results/screenshots/bug04_images_failure/section-4-images.png`

### Impacto en el Usuario
Impacto severo en la experiencia de marca. La visualización de secciones vacías y assets rotos da una imagen de producto incompleto y daña la credibilidad del contenido interactivo.

---

## BUG-05 — Mapa de Artículos: Lógica de Filtro Invertida en Ubicación y Días Inconsistentes

| Campo | Valor |
|---|---|
| **ID del Defecto** | BUG-05 |
| **Severidad** | Crítica |
| **Prioridad** | P1 |
| **Componente** | Buscador de Eventos / Mapa (Find Alpha Filters) |
| **Ruta Afectada** | `https://dev-site.hegetsus.com/articles` |
| **Navegador** | Chrome 124+ / Firefox / WebKit |
| **Estado** | Abierto (Open) |

### Descripción
1. **Lógica Invertida de Tipo de Ubicación:** En el panel de filtros del buscador "Find Alpha" (Mapa), al seleccionar la casilla de verificación **"In Person"** (Presencial) el sistema aplica el filtro mostrando únicamente grupos **"Online"** (En Línea). Viceversa, al marcar el filtro **"Online"** se muestran los resultados **"In Person"**. La lógica de filtrado de base de datos/interfaz está 100% invertida.
2. **Visualización de Días de la Semana:** Al elegir cualquier día de la semana específico de manera individual (por ejemplo, "Lunes" o "Monday"), el texto descriptivo del filtro no se actualiza y mantiene de forma permanente el mensaje `"All Days of the Week"`. Además, cuando se marcan **TODOS** los días de la semana, el icono visual representativo de "Todos los días" desaparece en lugar de mostrarse.

### Pasos para Reproducir
1. Ir a `/articles` y esperar que el mapa y la lista se carguen por completo.
2. Hacer clic en el botón de filtros interactivos para abrir el cajón (drawer) lateral de filtros.
3. Activar el filtro "In Person" en "Location Type". Observar las etiquetas en la lista de resultados.
4. Desactivar "In Person" y activar "Online". Observar la lista de resultados.
5. Seleccionar un único día (ej. "Monday"). Observar el texto de la etiqueta superior.
6. Seleccionar todos los días de la semana en la cuadrícula de días. Observar el estado del icono.

### Resultado Actual
* "In Person" activo -> Se muestran ítems de tipo Online. "Online" activo -> Se muestran ítems de tipo In Person.
* Un solo día seleccionado -> La etiqueta superior sigue diciendo "All Days of the Week". Todos los días seleccionados -> El icono del selector visual se oculta.

### Resultado Esperado
* La selección de "In Person" debe restringir estrictamente la lista de resultados a los grupos con etiqueta "In Person".
* Seleccionar un único día debe actualizar dinámicamente la cabecera del filtro con el nombre del día seleccionado (ej. "Monday").
* Seleccionar todos los días debe restaurar el icono visual representativo de la semana completa.

### Elemento / Selectores Afectados
```xpath
/* XPath exacto del Filtro de Ubicación */
//*[@id="__next"]/div/main/div/div[1]/div[2]/div/div/div/div/div/fieldset[1]/div

/* XPath exacto del Filtro de Días */
//*[@id="__next"]/div/main/div/div[1]/div[2]/div/div/div/div/div/fieldset[2]/div
```

### Evidencia Visual
* Evidencia de Filtro Invertido: `hegetsus-qa/test-results/screenshots/bug05_in_person_filter/in-person-selected.png`
* Evidencia de Día sin Cambios: `hegetsus-qa/test-results/screenshots/bug05_single_day_filter/monday-selected.png`

### Impacto en el Usuario
Impacto comercial y funcional crítico. El mapa de eventos es la herramienta principal de la plataforma para conectar a los usuarios con reuniones en el mundo real. Con los filtros invertidos y los días bloqueados, es prácticamente imposible para los visitantes ubicar y asistir a eventos locales reales.

---

## BUG-06 — Mapa de Artículos: Filtro de Selección de Idioma No Funcional

| Campo | Valor |
|---|---|
| **ID del Defecto** | BUG-06 |
| **Severidad** | Alta |
| **Prioridad** | P1 |
| **Componente** | Buscador de Eventos / Mapa (Find Alpha Filters) |
| **Ruta Afectada** | `https://dev-site.hegetsus.com/articles` |
| **Navegador** | Chrome 124+ / Firefox / WebKit |
| **Estado** | Abierto (Open) |

### Descripción
Al seleccionar un idioma específico en el filtro desplegable de idiomas en la sección del mapa, la etiqueta descriptiva del filtro permanece fija en `"All Languages"` (Todos los Idiomas), y la lista de resultados en el mapa no se filtra ni actualiza según el idioma seleccionado. El filtro está completamente congelado en el estado por defecto.

### Pasos para Reproducir
1. Ir a `/articles` y abrir el cajón de filtros.
2. Localizar el widget de selección de Idioma ("Language").
3. Hacer clic en una opción de idioma diferente del valor por defecto (por ejemplo, seleccionar "Spanish").
4. Verificar si cambia el estado visual del botón interactivo y si se actualiza la etiqueta de resumen del filtro.

### Resultado Actual
El resumen del filtro de idiomas muestra constantemente el texto "All Languages", los botones interactivos no retienen la clase visual `.active` o de selección activa del idioma elegido, y la lista de eventos mantiene todos los idiomas mezclados.

### Resultado Esperado
El estado de la aplicación debe registrar el idioma activo seleccionado, actualizar visualmente la etiqueta de resumen del filtro (por ejemplo, mostrando "Spanish" en lugar de "All Languages"), y actualizar inmediatamente la base de datos visual del mapa para desplegar únicamente reuniones registradas en ese idioma específico.

### Elemento / Selectores Afectados
```xpath
/* XPath exacto del Filtro de Idioma */
//*[@id="__next"]/div/main/div/div[1]/fieldset/div
```

### Evidencia Visual
* Evidencia de Selección Inactiva: `hegetsus-qa/test-results/screenshots/bug06_select_spanish/spanish-selected.png`

### Impacto en el Usuario
Los usuarios que buscan grupos específicos en idiomas no ingleses (como el español) no tienen ninguna vía para segmentar los eventos del mapa, limitando la accesibilidad multicultural y la inclusión dentro de la plataforma de He Gets Us.
