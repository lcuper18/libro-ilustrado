"""
database.py - Conexión SQLite3 y helper para queries
"""
import contextlib
import sqlite3
from pathlib import Path
from typing import Any, Generator

DB_PATH = Path(__file__).parent.parent / "data" / "libro.db"


@contextlib.contextmanager
def get_connection() -> Generator[sqlite3.Connection, None, None]:
    """Obtiene conexión a la base de datos con row factory como context manager."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


def init_db() -> None:
    """Crea las tablas si no existen."""
    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT DEFAULT 'Autor Anónimo',
                cover_color TEXT DEFAULT '#FFE5B4',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                story_id INTEGER NOT NULL,
                page_number INTEGER NOT NULL,
                image_emoji TEXT DEFAULT '📖',
                text TEXT NOT NULL,
                background_color TEXT DEFAULT '#FFFEF9',
                FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sounds (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER NOT NULL,
                sound_type TEXT NOT NULL,
                sound_url TEXT DEFAULT NULL,
                position_x REAL DEFAULT 50,
                position_y REAL DEFAULT 50,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
            )
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pages_story_id ON pages(story_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_sounds_page_id ON sounds(page_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pages_story_page ON pages(story_id, page_number)")

        conn.commit()


def fetch_one(query: str, params: tuple = ()) -> dict[str, Any] | None:
    """Ejecuta query SELECT y retorna un resultado como dict o None."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None


def fetch_all(query: str, params: tuple = ()) -> list[dict[str, Any]]:
    """Ejecuta query SELECT y retorna todos los resultados como lista de dicts."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
