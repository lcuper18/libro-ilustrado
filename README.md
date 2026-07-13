# Libro Ilustrado Interactivo 🌙📖

Página web interactiva para enseñar a niños de 1.er y 2.° grado. Cada página tiene iconos que emiten sonidos al tocarlos.

**Para la Prof. Tatiana Quirós** — Demo listo para presentar.

---

## Cómo usar (instrucciones rápidas)

### 1. Abre una terminal en la carpeta `backend`
2. Ejecuta: `python -m pip install -r requirements.txt`
3. Ejecuta: `python seed.py`
4. Ejecuta: `python -m uvicorn main:app --reload --port 8000`

### 5. Abre OTRA terminal en la carpeta `frontend`
6. Ejecuta: `python -m http.server 5500`

### 7. Abre el navegador en: http://localhost:5500

> **Nota:** Necesitas ambas terminales abiertas. Si no escuchas sonidos, haz click en cualquier parte de la página primero (el navegador lo requiere).

---

## Requisitos
- Python 3.10 o superior
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Dos ventanas de terminal

## Solución de problemas

| Problema | Solución |
|----------|----------|
| "Error al cargar" | Verifica que la terminal del backend esté abierta y sin errores |
| No hay sonido | Haz click en "Abrir el Libro" primero, luego en los iconos |
| Puerto ocupado | Cambia el puerto con `--port 8001` en uvicorn |
| `python` no reconocido | Prueba `python3` o `py` |

---

## Stack técnico
- **Frontend:** HTML + CSS + JavaScript (vanilla)
- **Backend:** FastAPI + Python 3.10+
- **Base de datos:** SQLite3
- **Sonidos:** Web Audio API (generados programáticamente)

## API
- `GET /api/stories` — Lista de historias
- `GET /api/stories/{id}` — Historia completa
- `GET /api/health` — Estado del servidor

---

## Alcance de esta versión
Esta es una **demo local** que incluye:
- ✅ 1 historia: "La Aventura de Lunita" (6 páginas)
- ✅ Iconos interactivos con sonidos
- ✅ Navegación con botones y teclado
- ❌ Sin panel de administración
- ❌ Sin autenticación
- ❌ Sin despliegue web

---

## Historia: La Aventura de Lunita

*Una gatita llamada Lunita explora el bosque y encuentra animales increíbles.*

| Página | Contenido | Sonido |
|--------|-----------|--------|
| 1 | Portada: Lunita en casa 🌙 | Música suave |
| 2 | Lunita entra al bosque 🌲 | Pájaro cantando |
| 3 | Encuentra un río 💧 | Agua fluyendo |
| 4 | Aparece Búho Sabio 🦉 | Ululato |
| 5 | Un perro amigable 🐕 | Ladrido |
| 6 | Lunita regresa a casa 🏠 | Aplausos |

---

## Cómo agregar más historias

Para agregar una historia diferente, edita el archivo `backend/seed.py`:

1. Crea un nombre único para tu historia
2. Define las páginas con texto, emoji e iconos
3. Ejecuta `python seed.py` para insertar los datos

> **Nota:** Esta demo solo incluye una historia a la vez. Para múltiples historias, sería necesario modificar el código del frontend.

---

## Estructura del proyecto

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
├── data/
│   └── libro.db             # SQLite (autogenerado)
└── plan.md                  # Documentación del proyecto
```

---

## Variables de entorno

Esta versión demo no requiere variables de entorno. El patrón para producción sería:

```
# .env (futuro)
DATABASE_URL=...
SECRET_KEY=...
ALLOWED_ORIGINS=http://localhost:5500,https://tudominio.com
```

---

**Creado para la Prof. Tatiana Quirós** — Julio 2026
