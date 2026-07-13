"""
main.py - FastAPI backend para Libro Ilustrado Interactivo
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Path as FastAPIPath
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import fetch_one, fetch_all, init_db
from models import StoryListModel, StoryDetailModel, PageModel

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5500",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="API Libro Ilustrado",
    description="Backend para libro ilustrado interactivo para niños",
    lifespan=lifespan,
)

static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "sounds")
app.mount("/sounds", StaticFiles(directory=static_dir), name="sounds")

images_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "images")
app.mount("/images", StaticFiles(directory=images_dir), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/stories", response_model=list[StoryListModel])
def get_stories():
    query = """
        SELECT s.id, s.title, s.author, s.cover_color, COUNT(p.id) as page_count
        FROM stories s
        LEFT JOIN pages p ON s.id = p.story_id
        GROUP BY s.id
        ORDER BY s.created_at DESC
    """
    return fetch_all(query)


@app.get("/api/stories/{story_id}", response_model=StoryDetailModel)
def get_story(story_id: int = FastAPIPath(ge=1)):
    story = fetch_one(
        "SELECT id, title, author, cover_color FROM stories WHERE id = ?",
        (story_id,)
    )
    if not story:
        raise HTTPException(status_code=404, detail="Historia no encontrada")

    rows = fetch_all("""
        SELECT p.id AS page_id, p.page_number, p.image_emoji, p.image_url, p.text, p.background_color,
               s.id AS sound_id, s.sound_type, s.sound_url, s.position_x, s.position_y
        FROM pages p
        LEFT JOIN sounds s ON s.page_id = p.id
        WHERE p.story_id = ?
        ORDER BY p.page_number, s.id
    """, (story_id,))

    pages_map = {}
    for row in rows:
        pid = row["page_id"]
        if pid not in pages_map:
            pages_map[pid] = {
                "id": pid, "page_number": row["page_number"],
                "image_emoji": row["image_emoji"], "image_url": row["image_url"],
                "text": row["text"], "background_color": row["background_color"], "sounds": []
            }
        if row["sound_id"] is not None:
            pages_map[pid]["sounds"].append({
                "id": row["sound_id"], "sound_type": row["sound_type"],
                "sound_url": row.get("sound_url"),
                "position_x": row["position_x"], "position_y": row["position_y"]
            })

    pages = [PageModel(**p) for p in pages_map.values()]
    return StoryDetailModel(**story, pages=pages)


@app.get("/api/stories/{story_id}/pages/{page_number}/sounds")
def get_page_sounds(story_id: int, page_number: int):
    page = fetch_one(
        "SELECT id FROM pages WHERE story_id = ? AND page_number = ?",
        (story_id, page_number)
    )
    if not page:
        raise HTTPException(status_code=404, detail="Página no encontrada")

    sounds = fetch_all(
        "SELECT id, sound_type, sound_url, position_x, position_y FROM sounds WHERE page_id = ?",
        (page["id"],)
    )
    return sounds


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Libro Ilustrado API funcionando"}
