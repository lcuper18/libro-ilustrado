# Libro Ilustrado Interactivo — Plan de Proyecto

> **Cliente:** Prof. Tatiana Quiros
> **Objetivo:** Demo funcional de libro infantil interactivo con ilustraciones y sonidos para enseñanza de 1.º-2.º grado primaria
> **Stack:** HTML · CSS · JavaScript (vanilla) · FastAPI · Python · SQLite3
> **Estado:** MVP implementado y entregado

---

## 1. Visión General

Una aplicación web que simula un libro físico con páginas que se pasan animadamente. Cada página contiene una ilustración, texto e iconos interactivos que reproducen sonidos de animales, naturaleza y música. Diseñado para niños de 6-8 años: navegación simple, colores vivos, botones grandes.

**Historia de ejemplo:** *La Aventura de Lunita* — una gatita que explora el bosque y encuentra animales. 6 páginas con vocabulario sencillo e ilustraciones generadas por IA.

---

## 2. Estructura del Proyecto

```
Libro_ilustrado/
├── backend/
│   ├── main.py              # FastAPI: endpoints REST + CORS + static files
│   ├── database.py          # SQLite3: conexión y esquema
│   ├── models.py            # Modelos Pydantic (validación)
│   ├── seed.py              # Script: poblar DB con historia ejemplo
│   └── requirements.txt     # fastapi, uvicorn, pydantic
├── frontend/
│   ├── index.html           # Interfaz completa del libro
│   ├── css/
│   │   └── style.css       # Estilos + animación pasar página
│   ├── js/
│   │   └── app.js           # Lógica: API, sonidos, navegación
│   ├── images/
│   │   ├── originals/       # Ilustraciones originales PNG
│   │   └── *.webp          # Ilustraciones comprimidas (~100KB c/u)
│   └── sounds/
│       └── *.mp3            # Archivos de audio
├── data/
│   └── libro.db             # SQLite (autogenerado)
├── plan.md                  # Documentación del proyecto
└── README.md                # Guía rápida
```

---

## 3. Esquema de Base de Datos

### Tabla `stories`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | Identificador único |
| `title` | TEXT | Título de la historia |
| `author` | TEXT | Nombre del autor |
| `cover_color` | TEXT | Color de fondo de portada |
| `created_at` | TIMESTAMP | Fecha de creación |

### Tabla `pages`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | Identificador único |
| `story_id` | INTEGER FK | Referencia a stories |
| `page_number` | INTEGER | Número de página (1-indexed) |
| `image_emoji` | TEXT | Emoji de la página (decorativo) |
| `image_url` | TEXT | URL de la ilustración (ej: `/images/page-1.webp`) |
| `text` | TEXT | Texto narrativo |
| `background_color` | TEXT | Color de fondo de la página |

### Tabla `sounds`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | Identificador único |
| `page_id` | INTEGER FK | Referencia a pages |
| `sound_type` | TEXT | Tipo: `bird`, `water`, `dog`, `owl`, `music`, `applause` |
| `sound_url` | TEXT | URL del archivo MP3 (ej: `/sounds/bird.mp3`) |
| `position_x` | REAL | Posición horizontal (% 0-100) |
| `position_y` | REAL | Posición vertical (% 0-100) |

---

## 4. API REST — Endpoints

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/api/stories` | Lista todas las historias |
| `GET` | `/api/stories/{id}` | Historia completa con páginas, ilustraciones y sonidos |
| `GET` | `/api/stories/{id}/pages/{num}/sounds` | Sonidos de una página específica |
| `GET` | `/api/health` | Verifica que el servidor está corriendo |
| `GET` | `/sounds/{archivo}.mp3` | Archivos de audio (FastAPI StaticFiles) |
| `GET` | `/images/{archivo}.webp` | Ilustraciones (FastAPI StaticFiles) |

---

## 5. Historia de Ejemplo: *La Aventura de Lunita*

| # | Página | Color | Sonido | Ilustración |
|---|--------|-------|--------|-------------|
| 1 | Lunita en su casa cerca del bosque 🌙 | Azul noche | 🎵 Música | page-1.webp |
| 2 | Lunita entra al bosque 🌲 | Verde bosque | 🐦 Pájaro | page-2.webp |
| 3 | Encuentra un río cristalino 💧 | Azul agua | 💧 Agua | page-3.webp |
| 4 | Aparece Búho Sabio 🦉 | Azul noche | 🦉 Ululato | page-4.webp |
| 5 | Un perro amigable 🐕 | Marrón | 🐕 Ladrido | page-5.webp |
| 6 | Lunita regresa a casa 🏠 | Naranja | 👏 Aplausos | page-6.webp |

---

## 6. Estrategia de Sonidos e Imágenes

### Sonidos — Archivos MP3
Los sonidos ya no se generan con Web Audio API. Se usan archivos MP3 pre-grabados servidos como archivos estáticos:

| Tipo | Archivo | Fuente |
|------|---------|--------|
| `bird` | `bird.mp3` | Archivo MP3 |
| `water` | `agua.mp3` | Archivo MP3 |
| `dog` | `dog.mp3` | Archivo MP3 |
| `owl` | `owl.mp3` | Archivo MP3 |
| `music` | `music.mp3` | Archivo MP3 |
| `applause` | `applause.mp3` | Archivo MP3 |

### Imágenes — WebP comprimidas
Ilustraciones generadas por IA (DALL-E / Midjourney) y comprimidas a ~100KB cada una con PIL:

| Página | Original | Comprimido | Reducción |
|--------|----------|------------|-----------|
| 1 | 2.4 MB PNG | 92 KB WebP | 96% |
| 2 | 2.4 MB PNG | 102 KB WebP | 96% |
| 3 | 2.4 MB PNG | 107 KB WebP | 96% |
| 4 | 2.4 MB PNG | 94 KB WebP | 96% |
| 5 | 2.5 MB PNG | 118 KB WebP | 95% |
| 6 | 2.4 MB PNG | 100 KB WebP | 96% |
| Portada | 2.1 MB PNG | 39 KB WebP | 98% |

---

## 7. Fases de Desarrollo

### Fase 1 — Setup ✅
- [x] Crear estructura de carpetas
- [x] Configurar entorno Python con requirements.txt
- [x] Crear base de datos SQLite con esquema
- [x] Ejecutar seed.py para poblar datos

### Fase 2 — Core Features ✅
- [x] Implementar endpoints FastAPI (stories, pages, sounds)
- [x] Crear frontend HTML/CSS con libro animado
- [x] Integrar archivos de audio MP3
- [x] Conectar frontend con backend via fetch

### Fase 3 — Ilustraciones ✅
- [x] Generar prompts para ilustraciones (DALL-E)
- [x] Comprimir ilustraciones (PIL WebP, ~100KB)
- [x] Integrar ilustraciones en el libro (Opción B: imagen + texto)
- [x] Agregar imagen de portada

### Fase 4 — Polish ✅
- [x] Animación de pasar página (CSS `rotateY`)
- [x] Navegación con teclado (← →)
- [x] Responsive design para tablets/móviles
- [x] Audio se detiene al cambiar de página
- [x] Eliminar emojis de páginas (solo ilustración + texto)

---

## 8. Criterios de Éxito

### Funcionales
- ✅ Libro abre desde portada con botón
- ✅ 6 páginas navegables con prev/next
- ✅ Ilustraciones visibles en cada página
- ✅ Iconos de sonido visibles y clickeables
- ✅ Cada icono reproduce un sonido diferente
- ✅ Audio se detiene al navegar a otra página
- ✅ Animación de pasar página fluida

### Usabilidad (niños 6-8 años)
- ✅ Botones grandes (> 44px) para dedos pequeños
- ✅ Sin texto extenso, vocabulario simple
- ✅ Feedback visual inmediato al tocar iconos
- ✅ No hay dead ends (siempre se puede navegar)

### Técnicos
- ✅ Backend corre en `localhost:7000`
- ✅ Frontend sirve en `localhost:5500`
- ✅ Sin errores en consola del navegador
- ✅ Imágenes comprimidas a ~100KB (carga rápida)

---

## 9. Comandos de Ejecución

```bash
# Backend (terminal 1)
cd backend
pip install -r requirements.txt
python seed.py
python -m uvicorn main:app --reload --port 7000

# Frontend (terminal 2)
cd frontend
python -m http.server 5500

# Abrir http://localhost:5500
```

---

## 10. Solución de Problemas

| Problema | Solución |
|----------|----------|
| "Error al cargar" en el navegador | Verifica que la terminal del backend esté abierta y el servidor corriendo en `localhost:7000` |
| No hay sonido al tocar los iconos | Haz click en "Abrir el Libro" primero (el navegador requiere interacción previa para audio) |
| Error "Puerto 7000 en uso" | Detén el proceso que usa el puerto o cambia con `--port 7001` en uvicorn |
| `python` no reconocido | Prueba `python3` o `py` en lugar de `python` |
| La página no carga (空白) | Verifica que el frontend esté corriendo en `localhost:5500` |
| Base de datos corrupta | Elimina `data/libro.db` y ejecuta `python seed.py` nuevamente |
| Ilustraciones no aparecen | Verifica que el backend sirva `/images` (montado en `main.py`) |

---

## 11. Variables de Entorno

Esta versión demo no requiere variables de entorno. Para producción:

```
# .env
DATABASE_URL=...
SECRET_KEY=...
ALLOWED_ORIGINS=http://localhost:5500,https://tudominio.com
```
