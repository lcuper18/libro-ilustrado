# La Aventura de Lunita 🌙📖

Libro ilustrado interactivo para enseñar a niños de 1.er y 2.° grado. Cada página tiene una ilustración e iconos que emiten sonidos al tocarlos.

**Para la Prof. Tatiana Quirós** — Demo listo para presentar.

---

## Cómo ejecutar

### 1. Backend (terminal 1)
```bash
cd backend
pip install -r requirements.txt
python seed.py
python -m uvicorn main:app --reload --port 7000
```

### 2. Frontend (terminal 2)
```bash
cd frontend
python -m http.server 5500
```

### 3. Abrir en el navegador
👉 http://localhost:5500

> **Nota:** Ambas terminales deben estar abiertas. Haz click en la página primero para activar el audio.

---

## Stack técnico
- **Frontend:** HTML + CSS + JavaScript (vanilla)
- **Backend:** FastAPI + Python 3.10+
- **Base de datos:** SQLite3
- **Sonidos:** Archivos MP3 servidos como archivos estáticos
- **Imágenes:** Ilustraciones en formato WebP (~100KB cada una)

---

## API REST

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/api/stories` | Lista todas las historias |
| `GET` | `/api/stories/{id}` | Historia completa con páginas, ilustraciones y sonidos |
| `GET` | `/api/stories/{id}/pages/{num}/sounds` | Sonidos de una página específica |
| `GET` | `/api/health` | Estado del servidor |
| `GET` | `/sounds/{archivo}.mp3` | Archivos de audio (estático) |
| `GET` | `/images/{archivo}.webp` | Ilustraciones (estático) |

---

## Historia: La Aventura de Lunita

*Una gatita llamada Lunita explora el bosque y encuentra animales increíbles.*

| Página | Contenido | Sonido |
|--------|-----------|--------|
| 1 | Lunita en su casa cerca del bosque 🌙 | Música suave |
| 2 | Lunita entra al bosque 🌲 | Pájaro cantando |
| 3 | Encuentra un río cristalino 💧 | Agua fluyendo |
| 4 | Aparece Búho Sabio 🦉 | Ululato |
| 5 | Un perro amigable 🐕 | Ladrido |
| 6 | Lunita regresa a casa 🏠 | Aplausos |

---

## Estructura del proyecto

```
Libro_ilustrado/
├── backend/
│   ├── main.py              # FastAPI: endpoints REST + CORS + archivos estáticos
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
│   │   ├── originals/       # Ilustraciones originales (PNG, no sube a git)
│   │   └── *.webp          # Ilustraciones comprimidas
│   └── sounds/
│       └── *.mp3            # Archivos de audio
├── data/
│   └── libro.db             # SQLite (autogenerado)
├── plan.md                  # Documentación del proyecto
└── README.md                # Este archivo
```

---

## Agregar una nueva historia

1. Edita `backend/seed.py`: crea un nombre único, define páginas con texto, emoji, color e imagen
2. Ejecuta `python seed.py` para insertar los datos
3. Coloca las ilustraciones en `frontend/images/` con el nombre `page-N.webp`

---

## Resolver problemas

| Problema | Solución |
|----------|----------|
| "Error al cargar" | Verifica que la terminal del backend esté abierta |
| No hay sonido | Haz click en "Abrir el Libro" primero |
| Puerto 7000 ocupado | Cambia con `--port 7001` en uvicorn |
| Base de datos corrupta | Elimina `data/libro.db` y ejecuta `python seed.py` |

---

**Creado para la Prof. Tatiana Quirós** — Julio 2026
