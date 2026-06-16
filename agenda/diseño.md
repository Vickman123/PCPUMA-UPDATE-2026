1. Paleta de Colores y Estilo Visual
El diseño se basa en una jerarquía visual clara dominada por degradados azules y fondos blancos para el contenido, transmitiendo tecnología, confianza y limpieza.

Colores Primarios (La Identidad)
Gradiente Principal (Brand): Utilizado en fondos de cabecera, botones principales y estados activos.

Inicio: #2196F3 (Azul Material Luminoso)

Fin: #00C6FF (Cian Brillante)

Dirección: Lineal, 135 grados.

Azul Institucional (Acento/Texto): #0D47A1 (Para títulos principales y elementos de alto contraste).

Colores Neutros (Estructura)
Fondo General (Canvas): #F4F6F9 (Gris muy pálido, casi blanco, para diferenciar de las tarjetas).

Superficies (Cards): #FFFFFF (Blanco puro con sombra suave).

Texto Principal: #333333 (Gris oscuro para nombres y datos).

Texto Secundario: #757575 (Gris medio para cargos y descripciones).

Colores Semánticos (Tags y Estados)
Tag TI/Soporte: Fondo #E3F2FD (Azul claro) / Texto #1976D2.

Tag Proveedores: Fondo #E8EAF6 (Índigo claro) / Texto #3F51B5.

Favorito (Estrella): #FFC107 (Ámbar).

2. Tipografía e Iconografía
Fuentes
Familia: Roboto o Open Sans (Sans-serif modernas).

Pesos:

Bold (700): Títulos de tarjetas y cifras del dashboard.

Medium (500): Botones y Títulos de sección.

Regular (400): Cuerpo de texto, correos y teléfonos.

Iconos
Estilo: Rounded (Material Symbols o FontAwesome con bordes redondeados).

Usos clave:

search: Lupa para buscador.

star: Favoritos.

phone: Acción de llamar.

email: Acción de correo.

domain: Icono para Entidad/Facultad.

3. Componentes de UI (Diseño Atómico)
A. Tarjeta de Contacto (The Card)
Basada en la Screen 2 y Screen 3 de la referencia. Es el elemento central del CRUD.

Contenedor: Fondo blanco, border-radius: 12px.

Sombra (Elevation): box-shadow: 0 2px 8px rgba(0,0,0,0.05). Hover: Aumenta la sombra y ligera elevación en Y.

Avatar (Izquierda):

Círculo de 48x48px.

Fondo: Color sólido aleatorio o azul primario.

Contenido: Iniciales del Nombre (Ej. "MG" para María García) en blanco, negrita.

Contenido (Centro):

Línea 1: Nombre Completo (Negrita, 16px) + Icono Estrella (si es favorito).

Línea 2: Cargo / Puesto (Regular, 14px, Gris).

Línea 3: Entidad o Empresa (Small, 12px, Gris claro).

Meta-Data (Derecha):

Badge/Tag: Píldora redondeada (border-radius: 50px) indicando el tipo (Ej. "TI", "Redes", "Hardware").

Acciones Rápidas (Hover): Botones sutiles de editar/borrar (solo admin).

B. Barra de Navegación y Búsqueda
Basada en la Screen 3 (Búsqueda).

Input de Búsqueda:

Debe dominar la parte superior de la vista de lista.

Estilo "Floating": Fondo blanco sobre el fondo gris de la página.

Bordes totalmente redondeados (border-radius: 25px).

Icono de lupa a la izquierda.

Texto placeholder: "Buscar por nombre, entidad o extensión..."

C. Tabs (Pestañas de Filtro)
Basadas en la Screen 2.

Estilo "Segmented Control" o "Pills".

Estado Inactivo: Texto gris, fondo transparente.

Estado Activo: Fondo Gradiente Azul, Texto Blanco, border-radius: 20px.

Opciones: [Todos] [Responsables TI] [Proveedores].

4. Estructura de Vistas (Layout)
Aunque la referencia es móvil, adaptaremos esto a una interfaz web responsiva.

Vista 1: Dashboard Principal (Home)
Referencia: Screen 1 (Pantalla Principal)

Hero Section: Un contenedor superior con el degradado azul.

Saludo al usuario (Ej. "Hola, Administrador").

Estadísticas rápidas en horizontal: "Total Contactos", "Sedes Registradas".

Accesos Directos: Tarjetas grandes (estilo botón) para:

Ver Directorio Completo.

Agregar Nuevo Registro (Acción flotante o botón destacado).

Gestión de Usuarios (Solo Admin).

Vista 2: El Directorio (Lista)
Referencia: Screen 2 (Vista de Contactos)

Layout de Rejilla (Grid):

Móvil: 1 columna (tarjetas apiladas verticalmente, idéntico a la imagen).

Escritorio: 2 o 3 columnas (Masonry o Grid). Las tarjetas se expanden horizontalmente.

Header Sticky: El buscador y los Tabs se quedan fijos al hacer scroll.

Vista 3: Modal de Detalle/Edición
En lugar de una pantalla nueva, al hacer clic en un contacto, se abrirá un Modal o Off-canvas (panel lateral derecho) para mantener el contexto.

Muestra toda la info extendida (RFC, Dirección completa, Notas).

Botones de acción grandes: "Editar", "Eliminar".

5. UX y Micro-interacciones
Feedback de Búsqueda:

La búsqueda debe ser "en vivo" (filtrado JS instantáneo).

Si no hay resultados, mostrar una ilustración vacía amigable.

Hover States:

Al pasar el mouse sobre una tarjeta, el borde debe iluminarse suavemente con el azul primario.

Loading:

Usar "Skeletons" (cajas grises pulsantes) mientras cargan los datos del CSV, en lugar de un spinner giratorio, para dar sensación de velocidad.

Botón Flotante (FAB):

En móvil, mantener un botón circular flotante (+) en la esquina inferior derecha para "Agregar Nuevo".

6. CSS Framework Sugerido
Para lograr este look rápidamente:

Framework Base: Bootstrap 5 (por su sistema de rejilla y modales).

Personalización: Sobrescribir las variables de Bootstrap:

$primary: #2196F3
# diseño.md

## Documento de Especificación de UI/UX: Directorio PC Puma
**Proyecto:** Directorio de Responsables TI y Proveedores (CRUD)
**Referencia Visual:** Material Design / Clean UI (Escala de Azules)
**Objetivo:** Interfaz moderna, minimalista y "App-like" que priorice la legibilidad y la rapidez de acceso a la información.

---

## 1. Identidad Visual y Colores

El diseño utiliza una jerarquía basada en la confianza (azul) y la limpieza (blanco/gris claro), evitando la saturación visual típica de los paneles administrativos antiguos.

### Paleta de Colores
| Variable CSS Sugerida | Código HEX | Uso Principal |
| :--- | :--- | :--- |
| `--color-primary` | `#2196F3` | Color base, botones primarios, iconos activos. |
| `--color-accent` | `#00C6FF` | Segundo color para degradados (Cyan brillante). |
| `--color-text-dark` | `#333333` | Títulos, Nombres de contacto. |
| `--color-text-muted` | `#757575` | Cargos, descripciones secundarias. |
| `--bg-body` | `#F4F6F9` | Fondo general de la página (Canvas). |
| `--bg-card` | `#FFFFFF` | Fondo de tarjetas y modales. |
| `--tag-ti-bg` | `#E3F2FD` | Fondo de etiqueta "TI/Soporte". |
| `--tag-ti-text` | `#1565C0` | Texto de etiqueta "TI/Soporte". |
| `--tag-prov-bg` | `#F3E5F5` | Fondo de etiqueta "Proveedores". |
| `--tag-prov-text` | `#7B1FA2` | Texto de etiqueta "Proveedores". |

### Gradientes
* **Brand Gradient:** `linear-gradient(135deg, #2196F3 0%, #00C6FF 100%)`
    * *Aplicación:* Header principal, Botones de acción flotante (FAB), Estado activo en navegación.

---

## 2. Tipografía

**Fuente Principal:** `Roboto`, `Inter` o `Open Sans` (Sans-serif limpia).

* **Títulos (H1, H2):** `Font-weight: 700` (Bold). Color `--color-text-dark`.
* **Subtítulos / Nombres en Tarjetas:** `Font-weight: 600` (Semi-Bold). Tamaño `1.1rem`.
* **Cuerpo / Datos:** `Font-weight: 400` (Regular). Tamaño `0.95rem`. Color `--color-text-muted`.
* **Etiquetas / Badges:** `Font-weight: 500` (Medium). Tamaño `0.75rem`. Texto en mayúsculas (opcional).

---

## 3. Componentes de UI (Atomic Design)

### A. La Tarjeta de Contacto (The Card)
El elemento central que reemplaza a las filas de tabla tradicionales.

* **Contenedor:**
    * Fondo: Blanco (`#FFF`).
    * Bordes: `border-radius: 12px`.
    * Sombra: `box-shadow: 0 4px 12px rgba(0,0,0,0.05)`.
    * Transición: `transform 0.2s ease, box-shadow 0.2s ease`.
* **Interacción (Hover):**
    * Al pasar el mouse: Sube ligeramente (`translateY(-3px)`) y la sombra se intensifica (`rgba(0,0,0,0.1)`).
* **Anatomía Interna:**
    1.  **Avatar (Izquierda):** Círculo de 48px. Fondo con color aleatorio pastel o iniciales del nombre.
    2.  **Info Principal (Centro):**
        * Nombre (Negrita).
        * Cargo (Gris, pequeño).
        * Entidad/Empresa (Gris muy claro, icono pequeño `domain`).
    3.  **Estado/Tag (Superior Derecha):** Píldora indicando "TI" o "Proveedor".
    4.  **Acciones Rápidas (Inferior):** Iconos de `Teléfono` y `Mail` que aparecen o se iluminan al hacer hover.

### B. Barra de Buscador "Flotante"
* **Diseño:** Input grande y centrado en la parte superior.
* **Estilo:** Fondo blanco sobre fondo gris.
* **Forma:** `border-radius: 30px` (Pill shape).
* **Sombra:** `box-shadow: 0 4px 15px rgba(33, 150, 243, 0.15)`.
* **Iconografía:** Icono de Lupa (`search`) a la izquierda, color gris.
* **Placeholder:** *"Buscar nombre, facultad, extensión o RFC..."*

### C. Navegación por Pestañas (Tabs)
* **Estilo:** Segmented Control (Píldoras).
* **Contenedor:** Fondo transparente o gris suave (`#E0E0E0`).
* **Item Activo:** Fondo **Brand Gradient**, Texto Blanco, Sombra suave.
* **Item Inactivo:** Fondo transparente, Texto Gris.

---

## 4. Estructura de Vistas (Layout)

### Layout General
1.  **Sidebar (Escritorio) / Bottom Bar (Móvil):** Navegación principal minimalista.
2.  **Main Content Area:** Donde se renderizan las tarjetas.

### Vista 1: Dashboard / Lista
* **Header:** Saludo ("Hola, Admin") + Estadísticas rápidas (Cards pequeñas con número total de registros).
* **Search Area:** Barra de búsqueda prominente + Filtros (Tabs).
* **Grid de Resultados:**
    * *Desktop:* CSS Grid `repeat(auto-fill, minmax(300px, 1fr))`. (Tarjetas flexibles).
    * *Mobile:* Lista vertical (una tarjeta debajo de otra).

### Vista 2: Modal de Detalle (Read/Update)
No navegar a otra página. Usar un **Modal** centrado o un **Off-canvas** (panel lateral derecho).

* **Header del Modal:** Fondo con *Brand Gradient*. Foto/Avatar grande centrado.
* **Body:** Formulario limpio en dos columnas (Escritorio) o una columna (Móvil).
* **Footer:** Botones de acción.
    * *Guardar:* Botón sólido color primario.
    * *Eliminar:* Texto rojo o botón contorneado rojo (zona de peligro).

---

## 5. Comportamientos y UX

* **Feedback de Carga:** Usar "Skeleton Screens" (barras grises pulsantes) en lugar de spinners mientras se leen los archivos CSV cifrados.
* **Búsqueda Instantánea:** Filtrado en tiempo real (Javascript) sin recargar la página.
* **Estados Vacíos (Empty States):** Si la búsqueda no arroja resultados, mostrar una ilustración vectorial simple (SVG) con el texto "No se encontraron contactos".
* **Notificaciones (Toasts):** Al guardar o eliminar, mostrar una alerta flotante pequeña en la esquina superior derecha ("Contacto guardado correctamente") con fondo verde/negro.

## 6. Iconografía Sugerida (Google Material Symbols)
Usar la librería `Material Symbols Outlined` o `Rounded`.
* `person` (Usuario)
* `business` (Proveedor/Empresa)
* `school` (Facultad/Entidad)
* `call` (Teléfono)
* `mail` (Correo)
* `edit` (Editar)
* `delete` (Borrar)
* `add` (Agregar nuevo - FAB)
$border-radius: 0.75rem (12px)

$card-border-width: 0 (Usar sombras en lugar de bordes).

$font-family-sans-serif: 'Roboto', sans-serif.