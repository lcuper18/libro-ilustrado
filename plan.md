# Libro Ilustrado Interactivo — Plan de Proyecto

> **Cliente:** Prof. Tatiana Quiros
> **Objetivo:** Demo funcional de libro infantil interactivo con sonidos para enseñanza de 1.º-2.º grado primaria
> **Stack:** HTML · CSS · JavaScript (vanilla) · FastAPI · Python · SQLite3
> **Estado:** Planificado

---

## 1. Visión General

Una aplicación web que simula un libro físico con páginas que se pasan animadamente. Cada página contiene texto e iconos interactivos que reproducen sonidos generados programáticamente (animales, naturaleza, música). Diseñado para niños de 6-8 años: navegación simple, colores vivos, botones grandes.

**Historia de ejemplo:** *La Aventura de Lunita* — una niña que explora el bosque y encuentra animales. 6 páginas con vocabulario sencillo.

---

## 2. Estructura del Proyecto

```
Libro_ilustrado/
├── backend/
│   ├── main.py              # FastAPI: endpoints REST + CORS
│   ├── database.py          # SQLite3: conexión y esquema
│   ├── models.py            # Modelos Pydantic (validación)
│   ├── seed.py              # Script: poblar DB con historia ejemplo
│   └── requirements.txt     # fastapi, uvicorn, pydantic
├── frontend/
│   ├── index.html           # Interfaz completa del libro
│   ├── css/
│   │   └── style.css       # Estilos + animación pasar página
│   └── js/
│       └── app.js           # Lógica: API, sonidos, navegación
└── data/
    └── libro.db             # SQLite (autogenerado)
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
| `image_emoji` | TEXT | Emoji principal de la página |
| `text` | TEXT | Texto narrativo |
| `background_color` | TEXT | Color de fondo de la página |

### Tabla `sounds`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | INTEGER PK | Identificador único |
| `page_id` | INTEGER FK | Referencia a pages |
| `sound_type` | TEXT | Tipo: `bird`, `water`, `dog`, `owl`, `music`, `applause` |
| `position_x` | REAL | Posición horizontal (% 0-100) |
| `position_y` | REAL | Posición vertical (% 0-100) |

---

## 4. API REST — Endpoints

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/api/stories` | Lista todas las historias |
| `GET` | `/api/stories/{id}` | Historia completa con páginas y sonidos |
| `GET` | `/api/stories/{id}/pages/{num}/sounds` | Sonidos de una página específica |
| `GET` | `/api/health` | Verifica que el servidor está corriendo |

---

## 5. Historia de Ejemplo: *La Aventura de Lunita*

| # | Página | Color | Sonido |
|---|--------|-------|--------|
| 1 | Portada: Lunita explora cerca de su casa 🌙 | Azul noche | 🎵 Música |
| 2 | Lunita entra al bosque y escucha un pájaro 🐦 | Verde bosque | 🐦 Pájaro |
| 3 | Encuentra un río cristalino 💧 | Azul agua | 💧 Agua |
| 4 | Aparece Búho Sabio ululando 🦉 | Azul noche | 🦉 Búho |
| 5 | Un perro amigable aparece 🐕 | Marrón | 🐕 Perro |
| 6 | Lunita regresa a casa feliz 🎉 | Naranja | 👏 Aplausos |

---

## 6. Estrategia de Sonidos

**No se usan archivos de audio.** Todos los sonidos se generan con Web Audio API:

| Tipo | Técnica |
|------|---------|
| `bird` | Oscilador `sine` con chirrido ascendente |
| `water` | Ruido rosa filtrado con `lowpass` |
| `dog` | Oscilador `sawtooth` con patrón de ladrido |
| `owl` | Oscilador `sine` con vibrato descendente |
| `music` | Secuencia de notas pentatónicas (`triangle`) |
| `applause` | Ráfagas de ruido filtrado (`highpass`) |

---

## 7. Fases de Desarrollo

### Fase 1 — Setup (30 min)
- [ ] Crear estructura de carpetas
- [ ] Configurar entorno Python con requirements.txt
- [ ] Crear base de datos SQLite con esquema
- [ ] Ejecutar seed.py para poblar datos

### Fase 2 — Core Features (60 min)
- [ ] Implementar endpoints FastAPI (stories, pages, sounds)
- [ ] Crear frontend HTML/CSS con libro animado
- [ ] Integrar Web Audio API para sonidos
- [ ] Conectar frontend con backend via fetch

### Fase 3 — Polish (30 min)
- [ ] Animación de pasar página (CSS `rotateY`)
- [ ] Navegación con teclado (← →)
- [ ] Responsive design para tablets
- [ ] Probar con niños reales

---

## 8. Criterios de Éxito

### Funcionales
- ✅ Libro abre desde portada con botón
- ✅ 6 páginas navegables con prev/next
- ✅ Iconos de sonido visibles y clickeables
- ✅ Cada icono reproduce un sonido diferente
- ✅ Animación de pasar página fluida

### Usabilidad (niños 6-8 años)
- ✅ Botones mínimos y grandes (> 44px)
- ✅ Sin texto extenso, vocabulario simple
- ✅ Feedback visual inmediato al tocar iconos
- ✅ No hay dead ends (siempre se puede navegar)

### Técnicos
- ✅ Servidor corre en `localhost:8000`
- ✅ Frontend sirve en `localhost:5500` (o archivo directo)
- ✅ Sin errores en consola del navegador
- ✅ CORS configurado correctamente

---

## 9. Comandos de Ejecución

```bash
# Backend
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend (servidor local para evitar CORS)
cd frontend
python -m http.server 5500
# Abrir http://localhost:5500
```

---

## 10. Archivos a Crear

| Archivo | Líneas estimadas | Responsabilidad |
|---------|-----------------|-----------------|
| `backend/database.py` | ~70 | Conexión SQLite + helper queries |
| `backend/models.py` | ~40 | Modelos Pydantic |
| `backend/main.py` | ~90 | Endpoints FastAPI |
| `backend/seed.py` | ~100 | Datos de ejemplo |
| `backend/requirements.txt` | ~3 | Dependencias |
| `frontend/index.html` | ~100 | Estructura HTML |
| `frontend/css/style.css` | ~350 | Estilos + animaciones |
| `frontend/js/app.js` | ~400 | Lógica completa |

**Total estimado:** ~1,150 líneas de código
