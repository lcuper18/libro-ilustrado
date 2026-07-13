# Libro Ilustrado Interactivo

Página web interactiva que simula un libro infantil con sonidos para niños de 1.er y 2.° grado de primaria.

## Stack Tecnológico

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** FastAPI + Python
- **Base de datos:** SQLite3
- **Sonidos:** Web Audio API (generación programática, sin archivos externos)

## Historia de Ejemplo

*La Aventura de Lunita* — una gatita que explora el bosque y encuentra animales. 6 páginas con iconos interactivos que emiten sonidos.

## Inicio Rápido

### Backend

```bash
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
python -m http.server 5500
# Abrir http://localhost:5500
```

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stories` | Lista de historias |
| GET | `/api/stories/{id}` | Historia con páginas |
| GET | `/api/stories/{id}/pages/{num}/sounds` | Sonidos de página |
| GET | `/api/health` | Estado del servidor |

## Estructura del Proyecto

```
Libro_ilustrado/
├── backend/
│   ├── main.py          # FastAPI
│   ├── database.py      # SQLite3
│   ├── models.py         # Pydantic
│   ├── seed.py           # Datos ejemplo
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
└── plan.md
```

## Para la Prof. Tatiana Quiros

Demo creado según specs. Los sonidos son generados por Web Audio API — no requieren archivos externos. Listo para presentar.
