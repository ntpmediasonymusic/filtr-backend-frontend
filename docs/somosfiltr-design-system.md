# SomosFiltr — Design System (extraído del frontend actual)

> Fuente analizada: `filtr-frontend-backend/frontend` (React 18 + Vite + Tailwind CSS v4, sin archivo de theme formal).
> Este documento describe **lo que existe hoy en el código**, no un rediseño. Todo lo marcado como *(inferido)* es una deducción razonable a partir de patrones repetidos, no un valor declarado explícitamente en una sola fuente.
> Objetivo: que el desarrollador de Shopify pueda replicar la identidad visual del sitio principal en la nueva sección **Merch**, para que el usuario no perciba un salto de marca al pasar de SomosFiltr a Shopify.

---

## 1. Resumen visual general

- **Tema:** dark UI. Fondo global casi negro (`#131517`), tarjetas en tonos gris-azulado/gris-morado oscuro, texto blanco.
- **Acento de marca:** degradado magenta → azul (`#CA249C` → `#004FD4`) usado en el header y el footer como "firma" de marca.
- **Colores de foco/interacción:** cian brillante (`#00DAF0`) para estados activos/enlaces de navegación, y magenta (`#CA249C`) para CTAs primarios dentro de formularios.
- **Formularios y modales claros:** a diferencia del resto del sitio (oscuro), los formularios de autenticación (Login/SignUp/EditAccount) y varios modales usan **fondo blanco con texto oscuro**, roto por iconografía y botones en magenta. Esto es un patrón deliberado y consistente en todo el flujo de cuentas.
- **Tipografía:** sans-serif por defecto de Tailwind (sin `font-family` global explícita) + `Montserrat` aplicada puntualmente a títulos de secciones y al saludo del header. Existen 3 fuentes decorativas cargadas (`Modak`, `Oi`, `Climate Crisis`) declaradas como tokens de Tailwind pero **no se usan en ningún componente actual** — probablemente reservadas para un rediseño futuro o abandonadas.
- **Layout:** una sola navbar fija arriba (gradiente), contenido con scroll, footer con el mismo degradado. Los listados (playlists, shows, géneros) se resuelven casi siempre como **carruseles horizontales con scroll-snap y flechas circulares**, o como **grid responsivo** para vistas completas (buscador, género seleccionado).
- **Micro-interacciones:** casi todo hover es `opacity`/`scale`/`bg` con `transition`, sin curvas de easing personalizadas. Loading states = skeletons grises con `animate-pulse`.

---

## 2. Paleta de colores

### 2.1 Marca / acento

| Token propuesto | Hex | Uso observado | Evidencia |
|---|---|---|---|
| `brand.magenta` | `#CA249C` (también visto como `rgb(202,36,156)` y minúscula `#ca249c`) | Botón primario de formularios (Entrar, Crear cuenta, Guardar cambios), borde de iconos de inputs, color del lado izquierdo del degradado de header/footer, botón "Aceptar cookies" | `LoginForm.jsx:265`, `Footer.jsx:12`, `NavMenu.jsx:53` |
| `brand.blue` | `#004FD4` (`rgb(0,79,212)`) | Lado derecho del degradado de header/footer | `Footer.jsx:12`, `NavMenu.jsx:55` |
| `brand.cyan` | `#00DAF0` | Item de navegación activo (texto + borde), borde de la barra de búsqueda, ícono de búsqueda, link "Ver evento" en ShowCard, iconos (Profile, MapMarker) | `NavMenuItem.jsx:20`, `PageHeader.jsx:152-153`, `ShowCard.jsx:222` |
| `brand.lime` | `#CFDD28` | Texto destacado secundario ("¡Entra ya!", títulos del banner de cookies/beta) | `Login.jsx:16`, `CookieConsentBanner.jsx:142` |
| `brand.spotify` | `#1DB954` | Botón "Continuar con Spotify" (color oficial de marca de terceros, no de Filtr) | `LoginForm.jsx:278` |
| `brand.mintCta` | `#B9F2CD` (hover `#a8e3bc`) | CTA "Iniciar sesión" dentro del `LoginModal` | `LoginModal.jsx:37` |

### 2.2 Fondos

| Token | Hex | Uso |
|---|---|---|
| `bg.page` | `#131517` | Fondo raíz de toda la app (`RegionLayout.jsx:44`), también fondo de la barra de búsqueda |
| `bg.surface1` (tarjeta playlist) | `#282534` | `PlaylistCard.jsx:217`, `TrendingPlaylistCard.jsx:58` |
| `bg.surface2` (tarjeta show) | `#262627` | `ShowCard.jsx:162`, inputs de formularios usan el mismo tono como borde `#262627` |
| `bg.surface3` (menús/modales) | `#282828` | `MobileMenu.jsx:23`, `LoginModal.jsx:29`, `CookieConsentBanner.jsx:111`, `CountryPicker.jsx:105` |
| `bg.arrowButton` | `#252733` | Botones circulares de flechas de carrusel (icono `#E1E1E2`) | `MainCategoryPreview.jsx:69`, `GenresHeader.jsx:166` |
| `bg.formCard` | `#FFFFFF` | Tarjetas de formulario (Login, SignUp, EditAccount) — contraste intencional sobre fondo oscuro | `LoginForm.jsx:182` |
| `bg.skeleton` | Tailwind `gray-700` con pulso `gray-600` | Placeholders de imágenes mientras cargan | `PlaylistCard.jsx:296`, `ShowsHeader.jsx:93` |

### 2.3 Texto

| Token | Valor | Uso |
|---|---|---|
| `text.onDark` | `#FFFFFF` / `white` | Texto principal sobre fondo oscuro |
| `text.onDarkMuted` | Tailwind `gray-400` | Placeholders, texto secundario ("No hay playlists disponibles") |
| `text.onLight` | Tailwind `gray-700` | Texto de inputs sobre fondo blanco |
| `text.onLightPrimary` | `#131517` | Texto de párrafos/links en formularios claros (mismo tono que el fondo global, reutilizado como "casi negro") |
| `text.error` | Tailwind `red-600` (`text-red-600`), corazón favorito `red-500` | Errores de validación, mensajes de API, "Eliminar mi cuenta" |
| `text.success` | Tailwind `green-600` | Mensaje de éxito al guardar perfil |

### 2.4 Bordes y estados

| Token | Valor | Uso |
|---|---|---|
| `border.input` | `#262627` | Borde de todos los inputs de formularios claros |
| `border.focusRing` | `#00DAF0` (borde de 2px, no usa `focus:ring`) | Barra de búsqueda |
| `border.subtle` | `white/10` (opacidad) | Botones outline de CTAs de shows, toggles |
| `state.hoverOpacity` | `hover:opacity-90` / `hover:opacity-60` / `hover:opacity-80` | Patrón dominante de hover en botones sólidos y links de header |
| `state.hoverBgSubtle` | `hover:bg-white/5` / `hover:bg-white/10` | Botones outline, opciones de selector de país |
| `state.disabled` | `opacity-50 cursor-not-allowed` aplicado condicionalmente por JS (no hay uso de la pseudo-clase `disabled:` de Tailwind) | Flechas de carrusel cuando no se puede scrollear más |

### 2.5 Colores contextuales (fuera del sistema de marca)

Estos valores aparecen en features específicas y **no deberían tratarse como parte del núcleo de marca**, pero se documentan porque aparecen en pantallas visibles (Shows):

| Hex | Uso |
|---|---|
| `#19A74E` (verde) | Toggle "Cerca de mí / Todos los eventos" en `Shows.jsx` |
| `#5C0F8B` (púrpura) | Toggle "Más próximos / Más lejanos" en `Shows.jsx` |

**Nota:** no hay un archivo central de tokens de color (no existe `tailwind.config.js` con `theme.colors`, Tailwind v4 usa `@theme` en CSS solo para fuentes). Todos los colores de marca están *hardcodeados inline* con `bg-[#hex]`/`text-[#hex]`/`style={{ backgroundColor }}` repetidos en cada componente. Esto confirma que **no existe una fuente única de verdad de color** en el proyecto — este documento y el JSON de tokens que lo acompaña son el primer intento de consolidarla.

---

## 3. Tipografía

### 3.1 Familias

```css
/* src/index.css */
@import url('...Modak...');
@import url('...Oi...');
@import url('...Climate+Crisis...');
@import url('...Montserrat:ital,wght@0,100..900;1,100..900...');

@theme {
  --font-modak: 'Modak', 'system-ui';
  --font-oi: 'Oi', 'serif';
  --font-climateCrisis: 'Climate Crisis', 'sans-serif';
  --font-montserrat: 'Montserrat', 'sans-serif';
}
```

- **Body / UI por defecto:** no hay ninguna clase `font-sans` ni CSS global de `body { font-family }`. El sitio cae en el **stack sans-serif por defecto de Tailwind v4** (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, ...`). *(inferido — no está escrito explícitamente, es el default de Tailwind)*.
- **Montserrat:** familia con más intención de marca. Se aplica selectivamente vía clase `font-montserrat` en:
  - Saludo del header (`PageHeader.jsx:96` — `font-bold text-lg md:text-[28px] font-montserrat`)
  - Títulos de categoría/sección (`MainCategoryPreview.jsx:99` — `font-bold text-lg md:text-2xl font-montserrat`)
  - Número gigante de ranking en Trending (`TrendingPlaylistCard.jsx:81` — `font-bold text-[100px] md:text-[150px] font-montserrat`, con `text-shadow` multicolor)
- **Modak / Oi / Climate Crisis:** declaradas pero **sin ningún uso encontrado** en componentes (`grep` de `font-modak|font-oi|font-climateCrisis` no arroja resultados fuera de `index.css`). Documentadas por si el compañero de Shopify las ve cargadas vía Google Fonts y se pregunta dónde se usan — la respuesta es: en ningún sitio del build actual.

**Recomendación para Shopify:** usar `Montserrat` como fuente de headings/marca y un sans-serif del sistema (o el default del theme de Shopify) para body/UI, replicando exactamente esta jerarquía dual.

### 3.2 Escala tipográfica observada

No existe una escala declarada (`h1`, `h2`... sin estilos base); cada componente define tamaño inline. Se listan los patrones dominantes agrupados por rol:

| Rol | Clases típicas encontradas | Ejemplo |
|---|---|---|
| H1 / saludo de página | `text-lg md:text-[28px] font-bold font-montserrat` | `PageHeader.jsx:96` |
| H1 alterno (páginas de auth) | `text-2xl md:text-3xl font-bold` | `Login.jsx:10` (“SOMOS FILTR”) |
| H2 / título de sección | `text-lg md:text-2xl font-bold font-montserrat` | `MainCategoryPreview.jsx:99` |
| H2 alterno | `text-2xl sm:text-3xl font-bold` | `GenresHeader.jsx:104` (“Elige un género”) |
| H2 tarjeta de show (fecha) | `text-[22px] md:text-[26px] font-black leading-tight` | `ShowCard.jsx:207` |
| H3 tarjeta de show (artista) | `text-[18px] md:text-[22px] font-medium leading-tight` | `ShowCard.jsx:210` |
| Modal / diálogo título | `text-xl font-bold` | `LoginModal.jsx:33` |
| Body / párrafo | `text-sm sm:text-base` | inputs y textos de formularios |
| Caption / error / hint | `text-xs sm:text-sm` | mensajes de validación (`text-red-600`) |
| Botón (label) | `text-sm sm:text-base font-semibold`, mayúsculas en el string ("ACCEDER", "CREAR CUENTA") | `LoginForm.jsx:267` |
| Número destacado (Trending) | `text-[100px] md:text-[150px] font-bold` | `TrendingPlaylistCard.jsx:81` |

- **Pesos usados:** `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-black` (Tailwind). No hay pesos intermedios custom.
- **Line-height:** solo utilidades de Tailwind (`leading-none`, `leading-tight`, `leading-normal`); no hay un valor numérico propio declarado. *(inferido: "tight" para títulos grandes, default para body)*.
- **Letter-spacing:** no se encontró ninguna clase `tracking-*` en todo el frontend → **letter-spacing por defecto (normal) en absolutamente todo**.
- **Texto en mayúsculas:** no se usa `uppercase` como clase CSS; los CTAs están en mayúsculas **directamente en el string** ("ACCEDER", "REGISTRARSE" no, pero "ACCEDER", "CREAR CUENTA", "GUARDAR CAMBIOS", "ACEPTAR COOKIES", "INICIAR SESIÓN"). Para Shopify, esto se puede resolver con `text-transform: uppercase` en la clase de botón para no depender de que el copy venga en mayúsculas.

---

## 4. Navegación / Header

Componente: `NavMenu.jsx` + `NavMenuItem.jsx` + `MobileMenu.jsx`.

```jsx
// NavMenu.jsx
<nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between text-white px-4
    ${isScrolled ? "backdrop-blur-sm py-1" : "py-4"}
    transition-[padding] duration-200 ease-in-out shadow-md`}
  style={{ backgroundImage: gradient }}>
```

- **Posición:** `fixed top-0`, `z-50`, ancho completo.
- **Fondo:** degradado dinámico `linear-gradient(to right, rgba(202,36,156,α) 0%→20%, rgba(0,79,212,α) 70%→100%)`. El `alpha` baja de `1` a `0.8` cuando `scrollY > 0`, y el padding vertical baja de `py-4` a `py-1` + `backdrop-blur-sm` (efecto "encoger al hacer scroll").
- **Logo:** `filtr_logo_white.svg`, `w-40 md:w-50`.
- **Links de escritorio (`NavMenuItem`):** ancho fijo `w-[122px]`, `rounded-[8px]`, `p-3`. Estado activo: `text-[#00DAF0] border border-[#00DAF0] p-[11px]` (el padding baja 1px para compensar el borde y no mover el layout). Estado inactivo: `text-white` sin borde.
- **Menú móvil (`MobileMenu`):** dropdown absoluto `w-2/3` a la derecha, `bg-[#282828]`, `rounded-[12px]`, `shadow-lg`; ítem activo con `border-b-2 border-[#00DAF0]`.
- **Offset de contenido:** el layout raíz compensa la navbar fija con `mt-[50px] md:mt-[80px]` en el contenedor de `<Outlet/>` (`RegionLayout.jsx:53`).

**Nota para Shopify:** el theme header de Shopify normalmente no es `fixed`; si se quiere el mismo efecto de encogerse al hacer scroll hay que replicarlo con JS. Como mínimo, replicar: el degradado de fondo, el logo blanco, y el estado activo en cian con borde.

---

## 5. Footer

Componente: `Footer.jsx`.

```jsx
<footer className="px-6 py-6 flex flex-col items-center" style={{
  backgroundColor: "rgb(0, 79, 212)",
  backgroundImage: "linear-gradient(to right, rgb(202, 36, 156) 0%, rgb(202, 36, 156) 20%, rgb(0, 79, 212) 70%, rgb(0, 79, 212) 100%)",
}}>
```

- Mismo degradado que el header, pero **estático** (sin alpha dinámico).
- Contenido centrado en columna: logo (`w-40 md:w-50`), luego iconos sociales (Instagram/TikTok/Spotify, `text-5xl`, `hover:text-gray-300 hover:scale-120`), luego links legales (`underline`, separador `|` solo visible en desktop), y copyright con crédito a la agencia (`Beyonder`), también con `underline`.
- **Patrón de hover uniforme:** `hover:text-gray-300 transition-colors` en todos los links de footer.

---

## 6. Botones

No existe un componente `<Button>` reutilizable; cada botón repite las clases inline. Se agrupan por variante observada:

### 6.1 Primary (acción principal de formulario)
```jsx
className="w-full py-2.5 sm:py-3 bg-[#ca249c] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base cursor-pointer"
```
Usado en: Entrar (`LoginForm`), Crear cuenta (`SignUpForm`), Guardar cambios (`EditAccountForm`), Aceptar cookies (`bg-[#ca249c] ... rounded` en `CookieConsentBanner`).

### 6.2 Secondary (marca de terceros / alternativa)
```jsx
className="w-full flex justify-center items-center gap-2 sm:gap-3 py-2.5 sm:py-3 bg-[#1DB954] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base cursor-pointer"
```
"Continuar con Spotify". Mismo shape que el primary, distinto color de marca externa.

### 6.3 Confirm / alterno claro
```jsx
className="w-full bg-[#B9F2CD] text-black py-3 px-6 rounded-[8px] font-semibold hover:bg-[#a8e3bc] transition-all duration-200 cursor-pointer"
```
CTA dentro de `LoginModal` ("Iniciar sesión") — único botón con fondo claro y texto negro; hover cambia el bg en vez de opacidad.

### 6.4 Outline
```jsx
className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 transition"
```
CTAs secundarios en `ShowCard` (Follow, Notify Me, RSVP, Waitlist, Play My City). Fondo transparente, borde sutil blanco 10%, hover añade un fondo blanco al 5%.

### 6.5 Toggle / segmented control
```jsx
// activo
"bg-[#19A74E] text-white"
// inactivo
"bg-[#19A74E]/20 text-white/50 hover:bg-[#19A74E]/30"
// contenedor: rounded-l-xl / rounded-r-xl, border border-white/10, px-3 py-2
```
Patrón dominante para grupos de 2 botones excluyentes (`Shows.jsx`). Color base cambia según el grupo (`#19A74E` vs `#5C0F8B`) pero la lógica de opacidad (20% inactivo, 30% hover, 100% activo) se repite igual.

### 6.6 Ghost / link-button (texto)
```jsx
className="underline underline-offset-2 font-semibold" // links
className="text-sm font-semibold text-[#131517] cursor-pointer underline underline-offset-2" // botón "Reenviar correo"
className="w-full mt-3 py-2 underline underline-offset-2 text-red-600 font-medium text-sm" // "Eliminar mi cuenta" (destructivo)
```

### 6.7 Disabled
No hay una clase `disabled:` de Tailwind en el código. El estado deshabilitado se resuelve **condicionalmente en JS**:
```jsx
className={`... ${canScrollLeft ? "hover:opacity-80" : "opacity-50 cursor-not-allowed"}`}
disabled={!canScrollLeft}
```
**Recomendación:** en Shopify sí conviene formalizar esto con `:disabled { opacity: .5; cursor: not-allowed; pointer-events: none; }` ya que Liquid/JS de theme puede no replicar el patrón condicional de React 1:1.

### 6.8 Hover/focus, patrón dominante
- Botones sólidos → `hover:opacity-90` (más usado) o `hover:opacity-80` en botones circulares de flechas.
- Links de texto/simples → `hover:opacity-60` (header) o `hover:text-gray-300` (footer).
- Iconos interactivos (favorito, compartir) → `hover:scale-110` con `transition-transform`.
- **No se usa `focus-visible` en ningún componente**; el único manejo de foco explícito es `focus:outline-none` en inputs (quita el outline nativo sin reemplazarlo por un anillo custom) y `focus:bg-white/10` en las opciones del selector de país. **Esto es una brecha de accesibilidad** a tener en cuenta — para Shopify se recomienda no repetir el `focus:outline-none` sin sustituto.

---

## 7. Links

- **Links de navegación:** ver sección 4 (estado activo = cian + borde).
- **Links dentro de texto/formularios:** `underline underline-offset-2`, casi siempre `font-semibold`, color heredado (blanco sobre fondo oscuro, `#131517` o `#ca249c` sobre fondo blanco).
- **Links externos target="_blank":** siempre con `rel="noopener noreferrer"`.
- **Hover dominante:** `hover:opacity-60` (header), `hover:text-gray-300` (footer), o sin cambio de color (solo el underline ya indica que es interactivo) en los links de formularios.

---

## 8. Cards

### 8.1 Playlist card (`PlaylistCard.jsx`, `TrendingPlaylistCard.jsx`)
```jsx
className="flex flex-col flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 bg-[#282534] rounded-lg p-3 gap-2.5"
```
- Imagen cuadrada (`before:pt-[100%]` = aspect-ratio 1:1 vía padding-top hack), `rounded-lg overflow-hidden`, `object-cover`.
- Overlay de play al hover: `absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity`.
- Skeleton: `bg-gray-700` + capa `animate-pulse bg-gray-600` mientras `!loaded`; fade-in de la imagen con `transition-opacity duration-500`.
- Footer de la card: título `line-clamp-2`, iconos de favorito (`FaHeart`/`FaRegHeart`, rojo cuando está activo) y compartir.

### 8.2 Show card (`ShowCard.jsx`)
```jsx
className="flex flex-col w-full xl:w-[360px] bg-[#262627] rounded-lg overflow-hidden"
```
- Imagen hero `h-[220px]` con `object-cover` + degradado inferior `bg-gradient-to-t from-[#262627] via-transparent to-transparent` para fundir con el cuerpo de la card.
- Fallback sin imagen: letra inicial del artista, `text-5xl font-black`.
- Cuerpo con `p-4 gap-5`: ubicación (icono `MapMarker` + texto), fecha (`font-black`), nombre artista (`font-medium`), link principal color cian, fila de botones outline (sección 6.4).

### 8.3 Tarjetas de género/mood (`GenresHeader.jsx`)
- Tiles rectangulares con radio grande (`rounded-2xl md:rounded-3xl`), borde grueso transparente que se vuelve blanco al seleccionar/hover: `border-2 md:border-4 border-transparent hover:border-white`, `scale-105` en estado seleccionado/hover.

**Patrón dominante de card:** fondo sólido oscuro (`#282534`/`#262627`/`#282828` según contexto) + `rounded-lg` (8px) + `overflow-hidden` + imagen con lazy-load y skeleton gris pulsante. Este es el patrón que Shopify debe replicar para las cards de producto de Merch.

---

## 9. Formularios / Inputs

Patrón idéntico repetido en `LoginForm`, `SignUpForm`, `PartialSignUpForm`, `EditAccountForm`, `ForgotPasswordForm`, `ResetPasswordForm`:

```jsx
// Contenedor del formulario
className="bg-white p-6 sm:p-10 rounded-[22px] max-w-[800px] w-full mx-auto flex flex-col gap-4 sm:gap-5"

// Wrapper de cada input (con icono a la izquierda)
className="flex items-center bg-white border border-[#262627] rounded-[8px] p-3 sm:p-4 gap-2 sm:gap-3"

// Input en sí
className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"

// Icono dentro del input
className="text-[#ca249c] w-6 h-6 sm:w-8 sm:h-8"
```

- **Selects:** mismo wrapper, `<select>` con `bg-transparent focus:outline-none text-gray-700`, sin flecha custom (nativa del navegador).
- **Checkboxes:** `w-4 h-4 accent-[#ca249c]` (usa la propiedad CSS nativa `accent-color`, no un checkbox custom).
- **Errores de campo:** `<p className="mt-1 text-xs sm:text-sm text-red-600">` justo debajo del input.
- **Errores globales de API:** `text-sm text-red-600 font-bold text-center`.
- **Mensaje de éxito:** `text-green-600`.
- **Toggle mostrar/ocultar contraseña:** ícono `FaEye`/`FaEyeSlash` color `#ca249c` dentro del mismo wrapper del input.
- **Divider entre secciones del form:** `<div className="h-[1px] w-full bg-[#ca249c]" />` envuelto en `my-4`.

**Contraste importante:** estos formularios rompen el tema oscuro global — son la única superficie 100% blanca del sitio. El icono/acento en todos los inputs es siempre magenta (`#ca249c`), nunca cian. Para Shopify, si el checkout/producto necesita un formulario, esta paleta clara + acento magenta es la referencia correcta (no la paleta oscura del resto del sitio).

---

## 10. Grillas / Listados

| Contexto | Clases | Comportamiento |
|---|---|---|
| Playlists por categoría (Home) | `flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory` | Carrusel horizontal con drag-to-scroll (pointerdown/move/up) + flechas circulares `bg-[#252733]` que aparecen si hay overflow |
| Playlists — vista completa (Género seleccionado, búsqueda) | `grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[14px] xl:gap-x-[24px] gap-y-[30px]`, envuelto en `2xl:max-w-[80%]` centrado | Grid responsivo clásico, 2→5 columnas |
| Géneros/Moods (selector horizontal) | `grid grid-flow-col auto-cols-min grid-rows-2 gap-2 md:gap-4 overflow-x-auto scrollbar-hide` | Grid de 2 filas que crece horizontalmente (como un "carrusel matricial"), también con drag-to-scroll |
| Premios (`Prizes.jsx`) | `divide-y-3 divide-gray-200` + banners apilados verticalmente `py-6 md:py-12` | Lista vertical simple con separadores |

**Contenedor global:** no hay un `.container` de Tailwind config; el ancho máximo se resuelve puntualmente con `max-w-[800px]` (formularios), `max-w-[500px]`/`max-w-lg` (modales), `2xl:max-w-[80%]` (grids de playlists). Padding horizontal de página dominante: `px-6` (a veces `px-4 md:px-6/8/10/12`).

---

## 11. Responsive / Mobile

- **Breakpoints:** los estándar de Tailwind (no hay `theme.screens` custom en `tailwind.config.js`): `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`, `2xl 1536px`.
- **Patrón dominante:** mobile-first, con 2–4 saltos de breakpoint por componente (`text-xs sm:text-sm md:text-base`, `w-40 sm:w-48 md:w-56 lg:w-64`).
- **Navbar:** menú horizontal completo desde `md:`; por debajo, ícono hamburguesa (`FaBars`/`FaTimes`) + dropdown absoluto.
- **Imágenes hero/banners:** usan `<picture>` con `<source media="(min-width:768px)">` para servir una imagen "desktop" y otra "mobile" — **esto es un patrón consistente en todos los banners** (`HeaderCarousel`, `ShowsHeader`, `MusicBanner`, `GenresHeader` tiles, `PrizeBannerImage`). Aspect ratio via `before:pt-[…%]` (ej. `26.5%` mobile / `20%` desktop).
- **Formularios:** pasan de una columna (`flex-col`) a dos (`sm:flex-row`) para pares de campos (Nombre/Apellidos, País/Fecha).
- **Tipografía:** casi todo título tiene al menos un salto `text-{a} md:text-{b}`.

---

## 12. Estilos de imágenes (patrón transversal)

Repetido en `PlaylistCard`, `TrendingPlaylistCard`, `GenresHeader`, `HeaderCarousel`, `ShowsHeader`, `MusicBanner`, `Prizes`:

1. Contenedor `relative overflow-hidden` con aspect-ratio fijo vía `before:block before:pt-[N%]` (hack de padding-top, no `aspect-ratio` CSS nativo).
2. Fondo base `bg-gray-700` + capa skeleton `absolute inset-0 animate-pulse bg-gray-600` mientras `!loaded`.
3. `<img>` (o `<picture>` con `source` desktop) con `loading="lazy"`, `object-cover`, `onLoad` que dispara `opacity-0 → opacity-100` con `transition-opacity duration-500`.

Esto es, junto con el sistema de botones, **el patrón más repetido y más importante de replicar** en Shopify para que el Merch se sienta nativo (mismo comportamiento de carga progresiva, mismo aspecto redondeado, mismo gris de placeholder).

---

## 13. Fondos y overlays

- Fondo raíz: `#131517` sólido.
- Overlays de modal: `bg-black/60` a pantalla completa (`fixed inset-0`).
- Overlay hover sobre imagen: `bg-black/50`.
- Degradado de marca (header/footer): ver sección 2.1/4/5.
- Degradado de scrollbar (webkit, decorativo, `index.css:26`): `linear-gradient(225deg, #FF3CAC 0%, #ffffff 50%, #2B86C5 100%)` — nota: introduce dos colores (`#FF3CAC`, `#2B86C5`) que **no aparecen en ningún otro lugar del sitio**; es un detalle cosmético aislado, no forma parte de la paleta principal.

---

## 14. Recomendaciones específicas para Shopify

1. **Crear un archivo de tokens** (usar `docs/somosfiltr-design-tokens.json` y `docs/somosfiltr-shopify-reference.css` de este mismo entregable) y mapearlo a `settings_schema.json` / CSS variables del theme, en vez de hardcodear hex en cada snippet Liquid — el frontend actual *no* tiene esta disciplina, pero para Shopify sí conviene, ya que el theme se edita con menos control de versiones que un repo React.
2. **Header de Shopify:** replicar el degradado magenta→azul y el logo blanco. Si el theme picker de Shopify no soporta headers `fixed` con blur al hacer scroll, es aceptable simplificarlo a un header estático con el mismo degradado — es el color el que ancla la marca, no el efecto de encogerse.
3. **Botón "Comprar" / "Ver producto" (CTA primario de Merch):** usar el estilo *Primary* (sección 6.1): `bg-[#CA249C]`, texto blanco, `font-semibold`, radio ~`8px` (`rounded-lg`), `hover:opacity-90`. Es el botón que el usuario ya asocia a "acción principal" en todo el sitio.
4. **Cards de producto:** replicar el patrón de card oscura (sección 8.1/12): fondo `#282534` (o `#262627`), imagen cuadrada con `object-cover`, radio `8px`, skeleton gris mientras carga, sin sombra dura (el sitio actual casi no usa `box-shadow` en cards, solo en modales/menús).
5. **Grid de catálogo:** usar el mismo breakpoint progresivo que `PlaylistsContainerGrid` (2 → 3 → 4 → 5 columnas) para que el catálogo de Merch "se sienta" como el resto de los listados de Filtr, en vez de inventar una grilla nueva.
6. **Filtros por artista/tipo de producto:** el componente más parecido conceptualmente es `GenresHeader`/`filter.jsx` — chips/tiles horizontales con selección única, borde blanco al seleccionar, scroll horizontal con flechas. Si el volumen de artistas es alto, esto se traduce mejor a un patrón de "chip seleccionable" que a un dropdown, para mantener consistencia visual.
7. **Transición SomosFiltr → Shopify:** dado que el objetivo es que "el usuario nunca sienta que salió del sitio", lo mínimo indispensable a igualar es: (a) fondo oscuro `#131517`, (b) tipografía Montserrat en headings, (c) botón primario magenta, (d) header con el degradado de marca. Si solo se puede replicar un subconjunto por limitaciones del theme, priorizar estos cuatro en ese orden.
8. **No replicar:** el `focus:outline-none` sin sustituto (brecha de accesibilidad ya presente en el sitio) y el hack de `before:pt-[%]` para aspect-ratio — Shopify/CSS moderno puede usar `aspect-ratio` nativo directamente con el mismo resultado visual.
9. **Fuentes decorativas (Modak/Oi/Climate Crisis):** no cargarlas en Shopify a menos que el equipo de marca confirme un uso futuro — hoy son peso muerto (Google Fonts sin consumo) y no forman parte de la identidad visible actual.

---

## 15. Qué es más importante conservar (prioridad para consistencia de marca)

En orden de impacto visual/reconocimiento de marca:

1. Fondo oscuro global `#131517`.
2. Degradado magenta (`#CA249C`) → azul (`#004FD4`) en header/footer.
3. Acento cian `#00DAF0` para estados activos/interactivos de navegación.
4. Botón primario magenta sólido, radio 8px, `hover:opacity-90`.
5. Tarjetas oscuras con esquinas redondeadas (`rounded-lg`) e imágenes con carga progresiva (skeleton gris).
6. Montserrat para títulos de sección.
7. Formularios en tarjeta blanca con icono/acento magenta (solo si Merch incluye un formulario, ej. talles/checkout embebido).

## 16. Valores que no se pudieron determinar con certeza

- **Line-height numérico exacto** de cada nivel tipográfico: el código solo usa utilidades (`leading-tight`, `leading-none`), nunca un valor en px/rem. Se documentó como "usa la utilidad de Tailwind", no un número inventado.
- **Letter-spacing:** confirmado como "sin overrides" (no hay clases `tracking-*` en el proyecto), no que el valor sea "0" explícitamente declarado en algún lugar.
- **Font-family real que renderiza el body:** depende del stack por defecto de Tailwind v4, que a su vez depende de la fuente del sistema operativo del usuario — no hay forma de confirmar un único valor "real" sin inspeccionar el CSS compilado en un navegador.
- **Altura estándar de botón (`--sf-button-height`):** no existe una altura fija; los botones usan `py-2.5`/`py-3` (padding), por lo que la altura final depende del tamaño de fuente + line-height del contenido. En el CSS de referencia se documenta como valor *inferido* a partir de `py-3` + `text-base` con line-height normal (~44–48px).
