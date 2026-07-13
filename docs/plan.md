# Plan de Proyecto — Libro Ilustrado Interactivo Infantil

> **Cliente:** Prof. Tatiana Quirós  
> **Proyecto:** "La Aventura de Lunita"  
> **Fecha de inicio:** Julio 2026  
> **Versión del documento:** 1.0  

---

## 1. Visión General del Proyecto

### 1.1 Resumen ejecutivo

Se desarrollará una **página web interactiva** que simula un libro infantil ilustrado con efecto de pase de hoja. Cada página del libro contendrá ilustraciones con **íconos clickeables** que, al ser pulsados, reproducirán sonidos generados mediante la **Web Audio API** del navegador (sin depender de archivos de audio externos). El sistema contará con un **backend administrativo** protegido por contraseña para que la profesora Tatiana Quirós pueda gestionar el contenido del libro: páginas, ilustraciones, íconos interactivos y sonidos asociados.

### 1.2 Objetivos

| # | Objetivo | Métrica de éxito |
|---|---|---|
| O1 | Entregar una experiencia de lectura interactiva para niños de 1º y 2º grado | El niño puede navegar el libro y activar sonidos sin ayuda |
| O2 | Permitir a la docente gestionar el contenido sin conocimientos técnicos | La docente crea/edita/elimina páginas e íconos en < 5 minutos |
| O3 | Funcionar sin dependencias externas de audio | Todos los sonidos se sintetizan con Web Audio API |
| O4 | Ser accesible desde cualquier navegador moderno | Compatible con Chrome, Firefox, Safari y Edge (versiones de los últimos 2 años) |

### 1.3 Alcance

**Incluido:**
- Frontend de libro interactivo con animación de pase de hoja
- Íconos clickeables con sonidos sintetizados (animales, naturaleza, objetos)
- Panel de administración con autenticación (usuario/contraseña)
- API REST para CRUD de páginas, íconos y configuraciones
- Persistencia en base de datos SQLite3
- Diseño responsivo para tablet (dispositivo principal) y desktop

**Excluido (para versión 1.0):**
- Narración por voz pregrabada
- Minijuegos o cuestionarios
- Soporte offline (PWA)
- Modo multilingüe (solo español)
- Carga de archivos de audio externos

### 1.4 Público objetivo

| Perfil | Descripción |
|---|---|
| **Usuario final** | Niños de 6 a 8 años (1º y 2º grado de primaria), lectores iniciales o pre-lectores |
| **Administradora** | Prof. Tatiana Quirós, docente de primaria, nivel de competencia digital básico-intermedio |

---

## 2. Arquitectura Técnica

### 2.1 Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Cliente)                   │
│                                                         │
│  ┌──────────────────────┐    ┌───────────────────────┐  │
│  │   Libro Interactivo  │    │  Panel Administrador  │  │
│  │   (público)          │    │  (/admin)             │  │
│  │                      │    │                       │  │
│  │  • BookRenderer      │    │  • PageManager        │  │
│  │  • PageFlip          │    │  • IconEditor         │  │
│  │  • IconInteraction   │    │  • SoundPreview       │  │
│  │  • SoundEngine       │    │  • AuthForm           │  │
│  └──────────┬───────────┘    └───────────┬───────────┘  │
│             │                            │              │
│             └──────────┬─────────────────┘              │
│                        │                                │
└────────────────────────┼────────────────────────────────┘
                         │  HTTP (JSON)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI (Servidor)                     │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │  Auth   │  │  Pages   │  │  Íconos / Sonidos     │  │
│  │ Router  │  │  Router  │  │  Router               │  │
│  └────┬────┘  └────┬─────┘  └───────────┬───────────┘  │
│       │            │                     │              │
│       └────────────┼─────────────────────┘              │
│                    ▼                                    │
│            ┌──────────────┐                             │
│            │   SQLite3    │                             │
│            │  (DB local)  │                             │
│            └──────────────┘                             │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla) | Sin dependencias externas; compatible con cualquier hosting estático |
| Animación de hoja | CSS 3D Transforms + JS | Efecto libro realista sin librerías pesadas |
| Sonido | Web Audio API | Síntesis de audio en tiempo real; sin archivos externos |
| Backend | FastAPI (Python 3.10+) | API rápida, documentación automática (Swagger), async-ready |
| Base de datos | SQLite3 | Cero configuración, ideal para volumen de datos pequeño |
| Autenticación | Token JWT (python-jose) | Sesiones stateless; fácil de implementar |
| Despliegue | Uvicorn + Nginx (proxy reverso) | Producción ligera y rápida |

### 2.3 Principios de diseño

1. **Separación de responsabilidades**: El frontend del libro (`/`) y el panel administrativo (`/admin`) son aplicaciones independientes que consumen la misma API.
2. **API-first**: Todo el contenido se sirve desde endpoints REST; el frontend es un consumidor puro.
3. **Zero dependencies externas en frontend**: Sin CDNs, sin frameworks JS. Solo HTML, CSS y JS nativo.
4. **Sonido procedural**: Los sonidos se definen por sus parámetros acústicos (frecuencia, tipo de onda, envolvente), no por archivos de audio.

---

## 3. Estructura de Archivos

```
Libro_ilustrado/
│
├── backend/
│   ├── main.py                  # Punto de entrada de FastAPI + Uvicorn
│   ├── config.py                # Configuración (DB path, secret key, etc.)
│   ├── requirements.txt         # Dependencias Python
│   ├── models.py                # Modelos SQLAlchemy / SQLite3
│   ├── database.py              # Conexión a DB + inicialización
│   ├── schemas.py               # Pydantic schemas (request/response)
│   ├── auth.py                  # Lógica de autenticación JWT
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth_router.py       # POST /api/auth/login
│   │   ├── pages_router.py      # CRUD /api/pages
│   │   └── icons_router.py      # CRUD /api/icons
│   │
│   ├── seed.py                  # Script para insertar datos iniciales
│   │
│   └── tests/
│       ├── __init__.py
│       ├── test_auth.py
│       ├── test_pages.py
│       └── test_icons.py
│
├── frontend/
│   ├── index.html               # Página del libro interactivo (público)
│   ├── admin.html               # Panel de administración (requiere login)
│   │
│   ├── css/
│   │   ├── book.css             # Estilos del libro y animación de hojas
│   │   ├── admin.css            # Estilos del panel administrativo
│   │   └── common.css           # Variables CSS, reset, tipografía
│   │
│   ├── js/
│   │   ├── lib/
│   │   │   ├── api.js           # Cliente HTTP genérico (fetch wrapper)
│   │   │   └── sound-engine.js  # Motor de síntesis de audio (Web Audio API)
│   │   │
│   │   ├── book/
│   │   │   ├── main.js          # Inicialización del libro
│   │   │   ├── page-renderer.js # Renderizado de páginas e íconos
│   │   │   ├── page-flip.js     # Lógica de pase de hoja
│   │   │   └── icon-interaction.js  # Manejo de clicks/taps en íconos
│   │   │
│   │   └── admin/
│   │       ├── main.js          # Inicialización del panel admin
│   │       ├── auth.js          # Login / logout / verificación de sesión
│   │       ├── page-manager.js  # CRUD de páginas (formulario + lista)
│   │       └── icon-editor.js   # CRUD de íconos y asignación de sonidos
│   │
│   └── assets/
│       └── illustrations/       # Ilustraciones de fondo por página (SVG/PNG)
│
├── docs/
│   ├── plan.md                  # Este documento
│   ├── api-reference.md         # Documentación de endpoints (autogenerada + manual)
│   └── user-guide-admin.md      # Guía de uso para la profesora
│
├── data/
│   └── libro.db                 # Base de datos SQLite3 (gitignored en producción)
│
└── README.md                    # Descripción general del proyecto
```

---

## 4. Esquema de Base de Datos

### 4.1 Diagrama Entidad-Relación

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │      pages       │       │    icons     │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)          │──┐    │ id (PK)      │
│ username     │       │ page_number (UQ) │  │    │ page_id (FK) │──┐
│ password_hash│       │ background_image │  │    │ name         │  │
│ created_at   │       │ text_content     │  │    │ position_x   │  │
│              │       │ created_at       │  │    │ position_y   │  │
│              │       │ updated_at       │  │    │ width        │  │
└──────────────┘       └──────────────────┘  │    │ height       │  │
                                              │    │ svg_content  │  │
                                              │    │ sound_params │  │
                                              │    │ created_at   │  │
                                              │    └──────────────┘  │
                                              │                      │
                                              └──────────────────────┘
                                                FK: icons.page_id → pages.id
                                                  (ON DELETE CASCADE)
```

### 4.2 Definición de tablas (SQL)

```sql
-- Tabla de usuarios administradores
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Tabla de páginas del libro
CREATE TABLE pages (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    page_number      INTEGER NOT NULL UNIQUE,
    background_image TEXT,       -- ruta relativa a /frontend/assets/illustrations/
    text_content     TEXT,       -- texto de la historia en esa página
    created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Tabla de íconos interactivos sobre cada página
CREATE TABLE icons (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id      INTEGER NOT NULL,
    name         TEXT    NOT NULL,         -- "mariposa", "sol", "río"
    position_x   REAL    NOT NULL DEFAULT 0, -- posición en % del ancho de página
    position_y   REAL    NOT NULL DEFAULT 0, -- posición en % del alto de página
    width        REAL    NOT NULL DEFAULT 10, -- tamaño en % del ancho de página
    height       REAL    NOT NULL DEFAULT 10, -- tamaño en % del alto de página
    svg_content  TEXT,                      -- SVG inline del ícono
    sound_type   TEXT    NOT NULL DEFAULT 'sine', -- tipo de onda base
    sound_params TEXT    NOT NULL DEFAULT '{}',   -- JSON con parámetros acústicos
    created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- Índices para rendimiento
CREATE INDEX idx_icons_page_id ON icons(page_id);
CREATE INDEX idx_pages_page_number ON pages(page_number);
```

### 4.3 Ejemplo de `sound_params` (JSON)

```json
{
  "type": "sine",
  "frequency": 440,
  "duration": 1.2,
  "gain": 0.7,
  "envelope": {
    "attack": 0.05,
    "decay": 0.1,
    "sustain": 0.6,
    "release": 0.4
  },
  "modulation": {
    "type": "tremolo",
    "rate": 4,
    "depth": 0.3
  }
}
```

Esto permite definir sonidos reconocibles de animales y naturaleza sin archivos de audio:
- **Pajarito**: frecuencia alta (800-1200 Hz), envolvente corta, modulación de frecuencia
- **Vaca**: frecuencia baja (150-200 Hz), duración larga, vibrato
- **Río**: ruido blanco filtrado, envolvente suave
- **Trueno**: ruido con envolvente de ataque rápido y decaimiento largo

---

## 5. Endpoints de la API

### 5.1 Autenticación

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión, devuelve token JWT | No |
| `POST` | `/api/auth/verify` | Verificar si el token actual es válido | JWT |

**POST /api/auth/login**
```json
// Request
{
  "username": "tatiana",
  "password": "contrasena_segura"
}

// Response 200
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer"
}
```

### 5.2 Páginas

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/pages` | Listar todas las páginas (ordenadas por page_number) | No |
| `GET` | `/api/pages/{id}` | Obtener una página con sus íconos | No |
| `POST` | `/api/pages` | Crear nueva página | JWT |
| `PUT` | `/api/pages/{id}` | Actualizar página existente | JWT |
| `DELETE` | `/api/pages/{id}` | Eliminar página y sus íconos asociados | JWT |

**GET /api/pages/{id} — Respuesta**
```json
{
  "id": 1,
  "page_number": 1,
  "background_image": "illustrations/portada.svg",
  "text_content": "Había una vez, en un bosque encantado...",
  "icons": [
    {
      "id": 1,
      "name": "sol",
      "position_x": 75.5,
      "position_y": 10.0,
      "width": 12.0,
      "height": 12.0,
      "svg_content": "<svg>...</svg>",
      "sound_type": "sine",
      "sound_params": { "frequency": 440, "duration": 1.0 }
    }
  ]
}
```

### 5.3 Íconos

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/pages/{page_id}/icons` | Listar íconos de una página | No |
| `POST` | `/api/pages/{page_id}/icons` | Agregar ícono a una página | JWT |
| `PUT` | `/api/icons/{id}` | Actualizar ícono (posición, sonido, SVG) | JWT |
| `DELETE` | `/api/icons/{id}` | Eliminar ícono | JWT |

### 5.4 Sonidos (preview)

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/sounds/preview` | Validar parámetros de sonido (útil para el editor) | No |

---

## 6. Componentes del Frontend

### 6.1 Vista pública: Libro interactivo (`index.html`)

```
┌─────────────────────────────────────────────────┐
│                  index.html                      │
│  ┌───────────────────────────────────────────┐  │
│  │              BookContainer                 │  │
│  │  ┌─────────────┐  ┌─────────────────────┐ │  │
│  │  │   Left      │  │      Right Page     │ │  │
│  │  │   Page      │  │                     │ │  │
│  │  │             │  │  • background img   │ │  │
│  │  │ • bg img    │  │  • text overlay     │ │  │
│  │  │ • text      │  │  • icons clickeables│ │  │
│  │  │ • icons     │  │                     │ │  │
│  │  └─────────────┘  └─────────────────────┘ │  │
│  │                                           │  │
│  │       [◀ Anterior]    [Siguiente ▶]       │  │
│  │       Página 3 de 12                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Módulos JS involucrados:**

| Módulo | Responsabilidad |
|---|---|
| `main.js` | Inicializar la app, cargar datos de `/api/pages`, coordinar módulos |
| `page-renderer.js` | Construir el DOM de cada página (fondo, texto, íconos) |
| `page-flip.js` | Animación CSS 3D de pase de hoja, navegación anterior/siguiente |
| `icon-interaction.js` | Detectar taps/clicks en íconos, delegar a `sound-engine.js` |
| `sound-engine.js` | Web Audio API: crear `AudioContext`, generar sonido según `sound_params` |
| `api.js` | Wrapper de `fetch()` con manejo de errores y reintentos |

### 6.2 Vista administrativa (`admin.html`)

```
┌─────────────────────────────────────────────────┐
│                  admin.html                      │
│  ┌───────────────────────────────────────────┐  │
│  │  Sidebar              │  Main Area        │  │
│  │                       │                   │  │
│  │  • Páginas           │  ┌───────────────┐ │  │
│  │  • Nueva página      │  │ Editor de     │ │  │
│  │  • Cerrar sesión     │  │ página/ícono  │ │  │
│  │                       │  │               │ │  │
│  │                       │  │ • Formulario  │ │  │
│  │                       │  │ • Previsualiz.│ │  │
│  │                       │  │ • Lista íconos│ │  │
│  │                       │  └───────────────┘ │  │
│  └───────────────────────┴───────────────────┘  │
└─────────────────────────────────────────────────┘
```

**Módulos JS involucrados:**

| Módulo | Responsabilidad |
|---|---|
| `main.js` | Verificar autenticación, cargar layout base |
| `auth.js` | Login/logout, almacenar token JWT en `sessionStorage`, interceptar 401 |
| `page-manager.js` | Listar páginas, formulario de creación/edición, reordenar |
| `icon-editor.js` | Posicionar íconos con drag & drop, asignar sonido con previsualización |
| `sound-engine.js` | (Reutilizado) Previsualizar sonido durante configuración de íconos |

### 6.3 Estrategia de posicionamiento de íconos

Los íconos se posicionan usando **porcentajes** relativos al contenedor de la página. Esto asegura que el diseño sea responsivo y se adapte a distintos tamaños de pantalla sin necesidad de recalcular coordenadas.

```css
/* La página derecha actúa como contenedor de referencia */
.book-page {
  position: relative;
}

/* Cada ícono se posiciona absolutamente dentro de la página */
.book-page .interactive-icon {
  position: absolute;
  left: var(--pos-x);   /* porcentaje calculado desde DB */
  top: var(--pos-y);
  width: var(--icon-w);
  height: var(--icon-h);
  cursor: pointer;
}
```

---

## 7. Plan de Implementación (Fases)

### Fase 0 — Configuración inicial (Duración estimada: 2 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T0.1 | Crear repositorio y estructura de carpetas | Directorios `backend/`, `frontend/`, `docs/`, `data/` |
| T0.2 | Configurar entorno virtual Python + dependencias | `backend/requirements.txt` con FastAPI, uvicorn, python-jose, passlib |
| T0.3 | Crear `backend/main.py` con app FastAPI mínima | Endpoint `GET /` que devuelva `{"status": "ok"}` |
| T0.4 | Crear `frontend/index.html` con HTML base | Página en blanco con estructura semántica |

### Fase 1 — Base de datos y modelos (Duración estimada: 3 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T1.1 | Definir modelo de datos en `models.py` | Clases/tablas: User, Page, Icon |
| T1.2 | Implementar `database.py` con inicialización | Función `init_db()` que crea tablas si no existen |
| T1.3 | Crear `schemas.py` con Pydantic models | Schemas de request/response para cada entidad |
| T1.4 | Escribir `seed.py` con datos de "La Aventura de Lunita" | 6-8 páginas iniciales con íconos y sonidos placeholder |
| T1.5 | Ejecutar y verificar seed | Base de datos poblada y funcional |

### Fase 2 — API REST (Duración estimada: 5 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T2.1 | Implementar `auth.py` (hash + JWT) | `POST /api/auth/login` funcional |
| T2.2 | Crear `routers/pages_router.py` | CRUD completo de páginas con validación |
| T2.3 | Crear `routers/icons_router.py` | CRUD de íconos asociados a páginas |
| T2.4 | Agregar middleware de autenticación JWT | Endpoints protegidos requieren token válido |
| T2.5 | Escribir tests unitarios para endpoints | Cobertura > 80% en rutas críticas |
| T2.6 | Probar API con Swagger UI (`/docs`) | Todos los endpoints documentados y funcionales |

### Fase 3 — Frontend: Libro interactivo (Duración estimada: 7 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T3.1 | Implementar `api.js` (cliente HTTP) | Fetch wrapper con manejo de errores |
| T3.2 | Implementar `sound-engine.js` | Web Audio API: oscilador, ganancia, envolvente ADSR |
| T3.3 | Implementar `page-renderer.js` | Renderizar página con fondo, texto e íconos desde API |
| T3.4 | Implementar `page-flip.js` | Animación CSS 3D de pase de hoja con transiciones |
| T3.5 | Implementar `icon-interaction.js` | Clicks en íconos → reproducir sonido + feedback visual |
| T3.6 | Diseñar estilos CSS para el libro (`book.css`) | Diseño atractivo, botones grandes, tipografía infantil |
| T3.7 | Integrar todo en `main.js` | Flujo completo: cargar páginas → navegar → interactuar |

### Fase 4 — Frontend: Panel administrativo (Duración estimada: 5 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T4.1 | Implementar `auth.js` (login, persistencia de token) | Flujo de autenticación completo |
| T4.2 | Implementar `page-manager.js` | Listado, creación, edición y eliminación de páginas |
| T4.3 | Implementar `icon-editor.js` | CRUD de íconos con posicionamiento drag & drop |
| T4.4 | Integrar previsualización de sonido en editor | Botón "Probar sonido" que usa `sound-engine.js` |
| T4.5 | Diseñar estilos del panel (`admin.css`) | Interfaz limpia, formularios claros, mensajes de feedback |

### Fase 5 — Integración, pruebas y pulido (Duración estimada: 4 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T5.1 | Pruebas de integración frontend ↔ backend | Flujo CRUD completo desde admin → visible en libro |
| T5.2 | Pruebas de usabilidad con niños | Sesión de observación: ¿pueden navegar y tocar íconos sin ayuda? |
| T5.3 | Optimización de rendimiento | Lazy loading de ilustraciones, caching de llamadas API |
| T5.4 | Correcciones de UI/UX basadas en feedback | Ajustes de tamaño, colores, posiciones |
| T5.5 | Responsive design para tablet (1024×768 y 2048×1536) | Layout funcional en orientación horizontal y vertical |
| T5.6 | Redacción de `README.md` y guía de administración | Documentación lista para entrega al cliente |

### Fase 6 — Despliegue y entrega (Duración estimada: 2 días)

| Tarea | Descripción | Entregable |
|---|---|---|
| T6.1 | Configurar Uvicorn + Nginx en servidor | Aplicación servida en dominio o IP |
| T6.2 | Prueba de humo en producción | Verificar que todo funciona en entorno real |
| T6.3 | Capacitación a la profesora Tatiana | Sesión de 30-45 min sobre uso del panel admin |
| T6.4 | Entrega formal + documentación impresa | Guía rápida de administración en PDF |

### Cronograma resumido

| Fase | Nombre | Días |
|---|---|---|
| 0 | Configuración inicial | 2 |
| 1 | Base de datos y modelos | 3 |
| 2 | API REST | 5 |
| 3 | Frontend: Libro interactivo | 7 |
| 4 | Frontend: Panel administrativo | 5 |
| 5 | Integración, pruebas y pulido | 4 |
| 6 | Despliegue y entrega | 2 |
| **Total** | | **28 días (≈ 6 semanas)** |

---

## 8. Consideraciones para Niños (UI/UX)

### 8.1 Principios de diseño infantil

| Principio | Aplicación en el proyecto |
|---|---|
| **Botones grandes** | Íconos interactivos de al menos 48×48px (tamaño táctil mínimo recomendado por WCAG) |
| **Colores vivos y contraste alto** | Paleta de colores primarios saturados; texto negro o azul oscuro sobre fondo claro |
| **Tipografía legible** | Fuente sans-serif de generoso tamaño (≥ 18px para texto narrativo) con interlineado amplio |
| **Feedback inmediato** | Cada ícono tocado emite sonido + animación de escala/pulso para confirmar la interacción |
| **Navegación obvia** | Flechas grandes (≥ 60px) para avanzar/retroceder; indicador visual de progreso |
| **Sin texto innecesario** | Instrucciones visuales mínimas; los niños de 1º grado pueden estar aprendiendo a leer |
| **Sin scroll** | Todo el contenido visible en pantalla sin necesidad de desplazamiento (pantalla completa) |
| **Tolerancia a errores** | Toques accidentales no rompen la experiencia; sin modales de confirmación ni diálogos |

### 8.2 Experiencia táctil (tablet-first)

- **Orientación principal**: Horizontal (landscape), que emula el formato de libro físico abierto.
- **Zonas táctiles generosas**: Mínimo 10×10% del área de página para cada ícono.
- **Sin gestos complejos**: Solo tap (toque simple). Sin swipe, pinch-to-zoom ni long-press.
- **Prevención de toques accidentales**: Pequeño debounce (300ms) para evitar doble activación.
- **Sin scroll accidental**: `overflow: hidden` en el contenedor del libro; `touch-action: manipulation` para prevenir zoom.

### 8.3 Feedback visual y sonoro

| Interacción | Feedback |
|---|---|
| **Tap en ícono** | Sonido (≤ 2 segundos) + animación de pulso (escala 1.0 → 1.2 → 1.0 en 400ms) + cambio de color momentáneo |
| **Pase de hoja** | Animación de página girando (800ms) + sonido sutil de "pasar página" (ruido blanco filtrado de 300ms) |
| **Llegar al final** | Las flechas se atenúan (no desaparecen); indicador textual "Fin del libro" |

### 8.4 Accesibilidad básica

- **Contraste mínimo 4.5:1** para texto (WCAG AA).
- **Etiquetas `aria-label`** en íconos interactivos y botones de navegación.
- **Atributo `role="button"`** y `tabindex="0"` para navegación por teclado (útil para docentes).
- **Sin dependencia de color**: los íconos tienen forma distintiva además de color.
- **Reducción de movimiento**: respetar `prefers-reduced-motion` desactivando animaciones de hoja.

---

## 9. Lista de Riesgos y Mitigaciones

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | **Web Audio API no soportada** en navegadores antiguos | Baja | Alto | Detectar soporte al inicio y mostrar mensaje de actualización; mantener fallback silencioso (íconos sin sonido pero con animación visual) |
| R2 | **Lentitud en tabletas escolares** (hardware limitado) | Media | Alto | Minimizar nodos DOM; usar CSS transforms acelerados por GPU; limitar a ≤ 8 íconos por página; precargar solo página actual + siguiente |
| R3 | **La docente no logra usar el panel admin** | Media | Alto | Diseñar interfaz ultra-simple; proveer guía impresa con capturas de pantalla; sesión de capacitación presencial de 30-45 min |
| R4 | **Cambio de requisitos** (nueva historia, más páginas, juegos) | Media | Medio | Arquitectura flexible: el contenido se sirve desde BD, no está hardcodeado; las fases 0-2 construyen la base extensible antes de comprometer diseño visual |
| R5 | **Problemas de rendimiento con Web Audio API** (múltiples sonidos simultáneos) | Baja | Medio | Pool de AudioContext compartido; máximo 1 sonido activo a la vez (detener anterior antes de reproducir nuevo); limpiar nodos tras cada reproducción |
| R6 | **Pérdida de datos** (corrupción de SQLite3) | Baja | Alto | Backup automático diario del archivo `libro.db`; script de exportación a JSON incluido en el panel admin; documentar procedimiento de restauración |
| R7 | **CSS 3D transforms no funcionan igual en todos los navegadores** | Media | Medio | Usar propiedades con prefijos (`-webkit-`, `-moz-`); probar en Chrome, Safari (iPadOS) y Firefox; implementar fallback de fade simple si 3D no está disponible |
| R8 | **Niños acceden accidentalmente al panel admin** | Baja | Crítico | El panel admin está en ruta separada (`/admin`); requiere login con JWT; CORS configurado restrictivamente; botón de admin oculto (sin enlace desde el libro) |
| R9 | **Ilustraciones muy pesadas** que ralentizan la carga | Alta | Medio | Usar SVG para ilustraciones (vectoriales, ligeras); comprimir PNGs con `pngquant` o `oxipng`; implementar lazy loading (cargar página actual + 1) |
| R10 | **Despliegue complejo** para entorno escolar sin soporte técnico | Media | Medio | Documentar despliegue con `docker-compose` como opción; alternativa: script de instalación único (`./deploy.sh`) que configura todo; evaluar hosting estático con backend serverless |

---

## Apéndice A: Historia placeholder — "La Aventura de Lunita"

> *Este es el contenido inicial que se cargará con el script `seed.py`. La profesora Tatiana podrá modificarlo desde el panel de administración.*

**Página 1 (Portada):** Título "La Aventura de Lunita" con ilustración de una niña bajo la luna. Ícono: luna (sonido de campanilla suave).

**Página 2:** "Lunita era una niña curiosa que vivía en un pequeño pueblo rodeado de montañas." Ilustración: paisaje de pueblo. Íconos: montaña, casita, nube.

**Página 3:** "Una noche, mientras miraba las estrellas, una luciérnaga brillante se posó en su ventana." Ilustración: ventana con cielo estrellado. Íconos: luciérnaga, estrella, ventana.

**Página 4:** "—¿Quieres venir conmigo? —parecía decirle la luciérnaga con su luz parpadeante." Ilustración: bosque de noche con sendero iluminado. Íconos: luciérnaga (grande), árbol, luna.

**Página 5:** "Juntas volaron sobre el río, donde los peces saltaban cantando." Ilustración: río bajo la luna. Íconos: pez, río, roca.

**Página 6:** "Llegaron a un jardín secreto donde las flores brillaban con luz propia." Ilustración: jardín mágico. Íconos: flor, mariposa, gota de rocío.

**Página 7:** "Lunita entendió que la magia vive en los lugares que miramos con el corazón." Ilustración: Lunita rodeada de luces. Íconos: corazón, estrella fugaz.

**Página 8 (Contraportada):** "Fin." Ilustración: Lunita durmiendo, luciérnaga en su mesita. Ícono: repetición (volver a empezar).

---

## Apéndice B: Paleta de colores sugerida

| Uso | Color | Código |
|---|---|---|
| Fondo general | Crema suave | `#FFF8F0` |
| Texto narrativo | Azul petróleo oscuro | `#1B3A4B` |
| Botones de navegación | Naranja cálido | `#FF8C42` |
| Feedback de ícono activo | Amarillo brillante | `#FFD23F` |
| Fondo de página | Blanco | `#FFFFFF` |
| Panel admin (sidebar) | Gris azulado | `#2C3E50` |
| Panel admin (acento) | Verde menta | `#1ABC9C` |

---

> **Control de cambios**  
> | Versión | Fecha | Autor | Cambios |  
> |---|---|---|---|  
> | 1.0 | 2026-07-12 | TechnicalWriter | Documento inicial completo |
