"""
main.py - FastAPI backend para Libro Ilustrado Interactivo
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import fetch_one, fetch_all, init_db
from models import StoryListModel, StoryDetailModel, PageModel

app = FastAPI(title="API Libro Ilustrado", description="Backend para libro ilustrado interactivo para niños")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


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
def get_story(story_id: int):
    story = fetch_one(
        "SELECT id, title, author, cover_color FROM stories WHERE id = ?",
        (story_id,)
    )
    if not story:
        raise HTTPException(status_code=404, detail="Historia no encontrada")

    pages_data = fetch_all(
        "SELECT id, page_number, image_emoji, text, background_color FROM pages WHERE story_id = ? ORDER BY page_number",
        (story_id,)
    )

    pages = []
    for page in pages_data:
        sounds = fetch_all(
            "SELECT id, sound_type, position_x, position_y FROM sounds WHERE page_id = ?",
            (page["id"],)
        )
        pages.append(PageModel(**page, sounds=sounds))

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
        "SELECT id, sound_type, position_x, position_y FROM sounds WHERE page_id = ?",
        (page["id"],)
    )
    return sounds


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Libro Ilustrado API funcionando"}
