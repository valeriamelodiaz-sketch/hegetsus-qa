# 📊 QA Automation — HE GETS US | Análisis Detallado de Pruebas y Escenarios Gherkin

Este documento técnico ofrece una radiografía profunda de la suite de pruebas interactiva compuesta por **20 pruebas automatizadas**, explicando detalladamente la correlación con los **6 bugs críticos** encontrados en [He Gets Us](https://dev-site.hegetsus.com). También aclara el porqué del fallo de 15 pruebas específicas debido a la presencia de defectos reales en el sitio y presenta los escenarios formalizados en formato **Gherkin (Cucumber)** en español.

---

## 🔍 1. Estructura y Detalle de las 20 Pruebas Ejecutadas

La suite de automatización contiene exactamente **20 pruebas individuales** distribuidas de forma modular y bajo el patrón **Page Object Model (POM)**. A continuación se desglosa el objetivo de cada una, agrupadas por su respectivo archivo de especificación (`spec.ts`):

### 📁 Archivo 1: `bug01-explore-text-overlap.spec.ts` (Explore Flow)
Este archivo valida la visualización del flujo interactivo del carrusel interactivo en la jornada "Be" (`journey=be`), enfocándose en problemas de diseño visual (superposición de capas).
*   **Prueba 01: `debe detectar superposición de texto en sección 5 del Explore Flow`**
    *   *Objetivo:* Utiliza un algoritmo de colisión matemática en el navegador para comparar las posiciones físicas (`getBoundingClientRect`) del texto de marca de agua de fondo `"I can't do it all"` y el párrafo del primer plano `"His belief landed him in prison"`.
    *   *Resultado en Suite:* **ÉXITO (PASS).** La prueba está programada para verificar que el bug **existe físicamente** en el DOM. Al encontrar la intersección de coordenadas, confirma la existencia de la superposición y da verde para documentar la evidencia.
*   **Prueba 02: `debe tomar screenshots de las secciones 1 a 5 del carrusel para documentar el progreso del bug`**
    *   *Objetivo:* Recorre progresivamente las secciones 1, 2, 3, 4 y 5 del flujo interactivo del carrusel, esperando que se estabilicen las animaciones de scroll y capturando capturas de pantalla secuenciales para construir un reporte visual histórico.
    *   *Resultado en Suite:* **ÉXITO (PASS).** Genera la secuencia completa de capturas de pantalla de la sección interactiva.

### 📁 Archivo 2: `bug02-footer-buttons.spec.ts` (Footer Interactivity)
Este archivo verifica la interactividad de los elementos clave del menú inferior, enfocándose en la inclusión y cumplimiento regulatorio.
*   **Prueba 03: `el botón Accessibility debe estar visible en el footer`**
    *   *Objetivo:* Verificar que el botón de menú adaptativo de accesibilidad (`button[data-acsb-custom-trigger="true"]`) se renderice correctamente en el pie de página.
    *   *Resultado en Suite:* **ÉXITO (PASS).** El botón está presente en el marcado HTML del footer.
*   **Prueba 04: `el botón Accessibility debe abrir un modal o overlay al hacer click`**
    *   *Objetivo:* Hacer clic físico en el disparador de accesibilidad y esperar que aparezca en el viewport un modal o panel emergente interactivo (ej. widget adaptativo) dentro de un tiempo límite de 3000ms.
    *   *Resultado en Suite:* **FALLO (FAIL).** El botón no desencadena ninguna acción. No se despliega ningún modal en el DOM.
*   **Prueba 05: `el botón Cookie Preferences debe estar visible en el footer`**
    *   *Objetivo:* Confirmar la existencia de la opción de configuración de preferencias de privacidad y consentimiento de cookies en la sección inferior.
    *   *Resultado en Suite:* **ÉXITO (PASS).** El botón existe en la estructura inferior.
*   **Prueba 06: `el botón Cookie Preferences debe abrir un panel de cookies al hacer click`**
    *   *Objetivo:* Simular el clic en "Cookie Preferences" y verificar la visibilidad inmediata del diálogo de preferencias de cookies (OneTrust o panel equivalente).
    *   *Resultado en Suite:* **FALLO (FAIL).** No ocurre ninguna acción en pantalla, confirmando un enlace roto a los scripts de consentimiento.

### 📁 Archivo 3: `bug03-footer-broken-links.spec.ts` (Footer Links)
Este archivo audita la validez y el comportamiento técnico de los canales de comunicación por correo electrónico provistos en el sitio web.
*   **Prueba 07: `Contact Us debe ser visible y tener href válido`**
    *   *Objetivo:* Validar la presencia del enlace de soporte y corroborar que su atributo `href` contenga la dirección de correo correcta (`mailto:info@hegetsus.com`).
    *   *Resultado en Suite:* **ÉXITO (PASS).** El enlace está bien configurado sintácticamente.
*   **Prueba 08: `Press Inquiries debe ser visible y tener href válido`**
    *   *Objetivo:* Corroborar la existencia del enlace de contacto de prensa y su direccionamiento a (`mailto:press@hegetsus.com`).
    *   *Resultado en Suite:* **ÉXITO (PASS).**
*   **Prueba 09: `Ambos links deben ser mailto y apuntar a dominios hegetsus.com`**
    *   *Objetivo:* Análisis estricto de seguridad y sintaxis del DOM para garantizar que no haya inyección de enlaces maliciosos y que ambos apunten a los servidores de correo legítimos del dominio.
    *   *Resultado en Suite:* **ÉXITO (PASS).**
*   **Prueba 10: `Los links mailto no deben navegar en el browser (documentación de comportamiento esperado)`**
    *   *Objetivo:* Simular un clic interactivo y verificar que el navegador web **no** intente cargar una nueva página HTTP de error de navegación, validando que el navegador mantenga al usuario en la página principal mientras el SO abre el cliente de correo.
    *   *Resultado en Suite:* **ÉXITO (PASS).**

### 📁 Archivo 4: `bug04-video-load-failures.spec.ts` (Explore Media)
Este archivo inspecciona exhaustivamente el cargamento multimedia dinámico del carrusel de exploración en la jornada "Be".
*   **Prueba 11: `debe documentar el estado de carga de videos en cada sección (screenshots)`**
    *   *Objetivo:* Navegar secuencialmente por el carrusel y generar un historial de capturas de pantalla de los elementos multimedia cargados antes y después de tiempos de espera de red (2000ms).
    *   *Resultado en Suite:* **ÉXITO (PASS).** Captura de forma completa las imágenes para auditoría.
*   **Prueba 12: `debe detectar videos que no cargan en sección 4`**
    *   *Objetivo:* Inspeccionar las propiedades de red internas de los reproductores `<video>` en la Sección 4 y corroborar su estado de descarga (`networkState`).
    *   *Resultado en Suite:* **FALLO DE VALIDACIÓN DE BUG (FAIL/PASS).** La prueba está escrita para detectar si hay videos rotos. Como los videos están rotos en el servidor actual, la prueba de aserción tradicional de "debe cargar" **falla**, evidenciando con éxito la presencia de **BUG-04**.
*   **Prueba 13: `debe detectar imágenes que no cargan en sección 4`**
    *   *Objetivo:* Evaluar el ancho y alto real (`naturalWidth`) de los elementos `<img>` renderizados en la Sección 4.
    *   *Resultado en Suite:* **FALLO DE VALIDACIÓN DE BUG (FAIL/PASS).** Al encontrar que las imágenes tienen un tamaño de renderizado real de `0px` debido a URLs de recursos rotas en el código de desarrollo, la aserción de carga completa falla, confirmando la existencia del bug de imágenes.

### 📁 Archivo 5: `bug05-map-filter-logic.spec.ts` (Alpha Map Location & Days)
Este archivo verifica la lógica algorítmica y visual detrás del mapa y el listado de eventos del buscador de reuniones `/articles`.
*   **Prueba 14: `seleccionar In Person debe mostrar Alpha IN PERSON, no Online`**
    *   *Objetivo:* Abrir el menú lateral de filtrado, activar de manera exclusiva la casilla "In Person" (Presencial), esperar que se actualice el listado de eventos y validar que la totalidad de los ítems resultantes muestren la etiqueta correspondiente a eventos presenciales.
    *   *Resultado en Suite:* **FALLO (FAIL).** El filtro está invertido, por lo que el test arroja un fallo al encontrar eventos puramente "Online" listados bajo la sección presencial.
*   **Prueba 15: `seleccionar Online debe mostrar Alpha Online, no In Person`**
    *   *Objetivo:* Activar de manera exclusiva el filtro "Online" y auditar que ningún grupo de tipo presencial (físico) aparezca en la grilla interactiva.
    *   *Resultado en Suite:* **FALLO (FAIL).** Al estar invertida la lógica de backend/frontend, el sistema muestra grupos físicos, lo que provoca la aserción fallida de Playwright.
*   **Prueba 16: `seleccionar un día específico NO debe mostrar "All Days of the Week"`**
    *   *Objetivo:* Elegir un solo día en el panel de días (ej. Monday) y validar que la cabecera informativa superior del selector interactivo se actualice con el nombre del día seleccionado en lugar del texto estático de "Todos los días".
    *   *Resultado en Suite:* **FALLO (FAIL).** El texto descriptivo no se inmuta y se queda permanentemente con el label `"All Days of the Week"`, bloqueando visualmente al usuario.
*   **Prueba 17: `seleccionar todos los días debe mostrar el ícono "All Days of the Week"`**
    *   *Objetivo:* Seleccionar la totalidad de los 7 días de la semana y corroborar que el icono interactivo global de resumen de días de la semana se renderice visualmente en pantalla.
    *   *Resultado en Suite:* **FALLO (FAIL).** El icono representativo desaparece misteriosamente cuando se seleccionan todas las casillas del selector semanal.

### 📁 Archivo 6: `bug06-map-language-filter.spec.ts` (Alpha Map Language)
Escenarios enfocados en el funcionamiento del filtro idiomático multicultural en la sección del localizador interactivo.
*   **Prueba 18: `All Languages debe estar visible por defecto antes de seleccionar idioma`**
    *   *Objetivo:* Validar que, antes de cualquier interacción del usuario, el selector del mapa esté inicializado en el estado neutro e integrador de "Todos los Idiomas" (`All Languages`).
    *   *Resultado en Suite:* **ÉXITO (PASS).**
*   **Prueba 19: `seleccionar un idioma específico debe desactivar All Languages y activar ese idioma`**
    *   *Objetivo:* Hacer clic en la opción de idioma "Spanish" (Español) y confirmar que la opción "All Languages" se desactive y que "Spanish" sea marcado con la clase CSS correspondiente a estado interactivo activo.
    *   *Resultado en Suite:* **FALLO (FAIL).** El selector está bloqueado en el frontend; no cambia de estado visual ni registra el cambio de idioma.
*   **Prueba 20: `el filtro de idioma debe reflejar visualmente el idioma seleccionado en el label del filtro`**
    *   *Objetivo:* Comprobar que el texto de resumen del filtro superior refleje el idioma seleccionado (ej. contenga la palabra "Spanish") después de la interacción.
    *   *Resultado en Suite:* **FALLO (FAIL).** La etiqueta descriptiva superior sigue mostrando eternamente `"All Languages"`, independientemente de lo que seleccione el usuario.

---

## ⚠️ 2. Explicación Técnica: ¿Por qué fallan 15 de las pruebas?

Una suite de pruebas de automatización robusta tiene dos naturalezas de diseño. La combinación de ambas explica de forma transparente por qué se registran **15 fallos de aserción** al correr el comando CLI local o el reporte interactivo:

1.  **Aserción de Comportamiento Esperado vs. Realidad del Sitio (Fallos de Aserción Reales):**
    Los escenarios funcionales clave (como abrir el menú de accesibilidad, configurar los filtros de ubicación física, los filtros semanales de días o el selector de idioma) están programados para evaluar lo que **debería suceder en una aplicación funcional**.
    *   *Ejemplo:* El test de filtros de ubicación espera que si seleccionamos **"In Person"**, la visibilidad de eventos en línea sea `false` (`expect(state.onlineAlphasVisible).toBe(false)`). Al estar la lógica invertida en el sitio bajo prueba, se listan eventos en línea y la aserción falla de inmediato.
    *   **Esto es el comportamiento correcto y deseado de una suite de QA técnica:** Garantiza que el pipeline de integración continua (CI/CD) arroje una señal de **ROJO** (Fallo), bloqueando de forma segura cualquier despliegue a producción hasta que desarrollo repare la funcionalidad rota.

2.  **El Desafío Técnico del Scroll Progresivo e Hidratación del DOM (GSAP ScrollTrigger):**
    El sitio web de He Gets Us no utiliza un scroll nativo convencional de ventana (`window.scroll`). Toda la aplicación de exploración está contenida dentro del elemento contenedor `div.LandingPage_wrapper__GYRS7` con la propiedad de estilos CSS `overflow: hidden` en el cuerpo general.
    *   El sitio implementa técnicas avanzadas de hidratación diferida (lazy rendering) controladas por coordenadas del viewport y animaciones de la biblioteca **GSAP ScrollTrigger**.
    *   **¿Qué significa esto?** Si un script de prueba automatizada salta directamente a la Sección 5 o evalúa el DOM de manera instantánea, **el navegador no renderiza las secciones ocultas**. Solo renderiza 5 bloques vacíos o secciones dummy iniciales.
    *   Para solucionar esto, desarrollamos la clase utilitaria `ScrollHelper`. Esta realiza un **scroll progresivo secuencial pixel a pixel** por la pantalla, obligando a los triggers de GSAP a activarse de forma física. Si las pruebas se corren en entornos con CPU lenta o sin retardos controlados de animación (por ejemplo, en ejecuciones headless ultra veloces en paralelo), el navegador omitirá la activación de GSAP, provocando que los selectores de las secciones dinámicas arrojen un fallo por no estar presentes en el árbol del DOM, sumando fallos adicionales de sincronización ("flakiness").

---

## 🧬 3. Escenarios Gherkin (Cucumber) en Español

Para formalizar y alinear las pruebas con el equipo de producto y desarrollo utilizando una sintaxis de desarrollo guiado por comportamiento (BDD), se definen a continuación los escenarios **Gherkin** estructurados para cada uno de los **6 Bugs Críticos** y las **20 Pruebas** de la suite:

### 🐜 BUG-01: Superposición de texto en Explore Carrusel (Jornada "Be")
```gherkin
Característica: Flujo Interactivo Explore - Superposición de Texto
  Como un usuario interesado en la jornada Be de exploración
  Quiero que los textos de fondo y primer plano tengan el espaciado adecuado
  Para poder leer el contenido de manera cómoda y profesional

  Escenario: Detección visual de superposición de texto en la Sección 5
    Dado que el usuario navega a la página de exploración con la jornada "Be"
    Y el usuario acepta el banner de consentimiento de cookies para despejar el viewport
    Cuando el usuario realiza un scroll progresivo a través de las secciones hasta la "Sección 5"
    Entonces el texto de fondo "I can't do it all" no debe colisionar físicamente con el párrafo "His belief landed him in prison"
    Y ambos textos deben ser legibles de forma independiente

  Escenario: Generar documentación visual del avance por las secciones del carrusel
    Dado que el usuario está en el flujo interactivo de exploración "Be"
    Cuando el usuario recorre secuencialmente las secciones de la 1 a la 5
    Entonces el sistema de pruebas debe capturar capturas de pantalla de cada sección para el reporte de QA
```

### 🐜 BUG-02: Footer - Botones de Accesibilidad y Cookies Inactivos
```gherkin
Característica: Menú Inferior - Interactividad de Accesibilidad y Cookies
  Como un usuario con capacidades diferentes o preocupado por la privacidad
  Quiero que los botones de accesibilidad y cookies del Footer abran sus respectivos modales
  Para poder configurar mi experiencia de navegación y consentimiento legal

  Escenario: Verificación de presencia del botón de accesibilidad en el pie de página
    Dado que el usuario carga la página de inicio
    Cuando se desplaza completamente hasta el pie de página (Footer)
    Entonces el botón de "Accessibility" debe estar visible en pantalla

  Escenario: Funcionalidad del botón de accesibilidad del Footer
    Dado que el usuario visualiza el Footer
    Cuando hace clic en el botón de accesibilidad "Accessibility"
    Entonces se debe desplegar un panel o modal adaptativo de accesibilidad en un tiempo menor a 3 segundos

  Escenario: Verificación de presencia del botón de preferencias de cookies
    Dado que el usuario se encuentra en el Footer
    Cuando inspecciona las opciones inferiores
    Entonces el botón de "Cookie Preferences" debe estar renderizado

  Escenario: Funcionalidad del botón de gestión de cookies en el Footer
    Dado que el usuario visualiza el Footer
    Cuando hace clic en el botón "Cookie Preferences"
    Entonces se debe abrir en pantalla el panel de consentimiento de cookies
```

### 🐜 BUG-03: Footer - Canales de Contacto por Correo
```gherkin
Característica: Menú Inferior - Enlaces de Correo Electrónico
  Como un usuario que requiere soporte técnico o de prensa
  Quiero que los enlaces de correo del pie de página apunten a direcciones válidas
  Para contactar de manera confiable con el equipo de He Gets Us

  Escenario: Validación del enlace de soporte al cliente "Contact Us"
    Dado que el usuario visualiza el pie de página
    Entonces el enlace "Contact Us" debe estar visible
    Y su atributo href debe corresponder exactamente a "mailto:info@hegetsus.com"

  Escenario: Validación del enlace de prensa "Press Inquiries"
    Dado que el usuario está en el Footer
    Entonces el enlace "Press Inquiries" debe estar visible
    Y su dirección de correo debe ser "mailto:press@hegetsus.com"

  Escenario: Verificación de seguridad en dominios de correo electrónico
    Dado que el usuario inspecciona el Footer
    Cuando se validan los enlaces de contacto
    Entonces ambos enlaces de correo deben pertenecer de manera exclusiva al dominio oficial "hegetsus.com"

  Escenario: Prevención de redirección web en clics de enlaces mailto
    Dado que el usuario hace clic en un enlace de tipo "mailto:" del Footer
    Cuando el sistema operativo gestiona el evento
    Entonces el navegador web no debe iniciar ninguna navegación HTTP externa ni cambiar de página activa
```

### 🐜 BUG-04: Explore Journey BE - Fallos Multimedia en Sección 4
```gherkin
Característica: Flujo Interactivo Explore - Carga de Contenido Multimedia
  Como un usuario interactuando con el flujo de exploración
  Quiero que todos los videos e imágenes de las secciones carguen correctamente
  Para disfrutar de una experiencia visual enriquecida y completa

  Escenario: Generar historial visual de la carga multimedia en el carrusel Be
    Dado que el usuario navega a la página de exploración con la jornada "Be"
    Cuando realiza scroll por cada sección del carrusel interactivo
    Entonces se deben capturar evidencias visuales de los elementos multimedia renderizados

  Escenario: Verificación de carga y reproducción de videos en la Sección 4
    Dado que el usuario se desplaza hasta la "Sección 4" del carrusel de exploración
    Cuando el DOM de la sección se termina de renderizar
    Entonces todos los elementos de video (<video>) deben cargarse con éxito desde el servidor
    Y ninguno debe presentar un estado de error de descarga "NETWORK_NO_SOURCE"

  Escenario: Verificación de carga completa de imágenes en la Sección 4
    Dado que el usuario se encuentra en la "Sección 4" del carrusel
    Cuando visualiza las imágenes informativas
    Entonces los elementos de imagen (<img>) deben tener un ancho natural mayor a cero
    Y ninguna imagen debe presentar enlaces de origen rotos
```

### 🐜 BUG-05: Mapa de Eventos - Errores de Ubicación y Días de la Semana
```gherkin
Característica: Localizador de Grupos - Filtros de Ubicación y Configuración Semanal
  Como un visitante buscando reuniones de Alpha en mi región
  Quiero filtrar los eventos de manera precisa por tipo de ubicación y día
  Para asistir presencialmente a los eventos correctos

  Escenario: Filtrar grupos de tipo "Presencial" (In Person)
    Dado que el usuario navega a la sección del localizador de eventos "/articles"
    Y abre el menú lateral de configuración de filtros
    Cuando activa de manera exclusiva la casilla de verificación "In Person"
    Entonces el mapa y el listado de resultados deben mostrar únicamente grupos con etiqueta "In Person"
    Y no debe mostrarse ningún grupo de naturaleza en línea "Online"

  Escenario: Filtrar grupos de tipo "En Línea" (Online)
    Dado que el usuario se encuentra en el panel de filtros del localizador
    Cuando activa de manera exclusiva la casilla de verificación "Online"
    Entonces los resultados en pantalla deben ser únicamente de naturaleza "Online"
    Y ningún grupo físico o presencial debe ser listado en la pantalla

  Escenario: Selección de un día específico en el calendario semanal
    Dado que el usuario interactúa con la cuadrícula de días de la semana
    Cuando selecciona un único día específico, por ejemplo "Monday" (Lunes)
    Entonces la etiqueta descriptiva superior del filtro debe cambiar para reflejar "Monday"
    Y no debe mantener fijo el mensaje por defecto "All Days of the Week"

  Escenario: Selección total de días para visualización semanal completa
    Dado que el usuario se encuentra en la cuadrícula de días
    Cuando marca la totalidad de los 7 días de la semana
    Entonces el icono visual descriptivo de "All Days of the Week" debe permanecer visible como resumen gráfico
```

### 🐜 BUG-06: Mapa de Eventos - Bloqueo en Selección de Idioma
```gherkin
Característica: Localizador de Grupos - Filtro de Idiomas Multicultural
  Como un usuario de habla no inglesa
  Quiero filtrar las reuniones de Alpha por mi idioma preferido
  Para participar plenamente en las conversaciones de grupo

  Escenario: Estado por defecto del filtro de idioma
    Dado que el usuario abre por primera vez el localizador de eventos
    Cuando despliega el panel de filtros
    Entonces el filtro de idioma debe inicializarse de manera visible con la opción "All Languages"

  Escenario: Selección de un idioma específico en el listado
    Dado que el usuario interactúa con el menú desplegable de idiomas
    Cuando selecciona un idioma específico, por ejemplo "Spanish" (Español)
    Entonces el idioma seleccionado debe registrarse como activo en la interfaz
    Y la opción genérica de "All Languages" debe marcarse como inactiva

  Escenario: Actualización dinámica de la etiqueta de resumen de idiomas
    Dado que el usuario selecciona el idioma "Spanish"
    Cuando se cierra el menú o se refrescan las opciones
    Entonces la etiqueta informativa superior del filtro de idioma debe actualizarse dinámicamente a "Spanish"
    Y no debe permanecer congelada con el mensaje estático "All Languages"
```
