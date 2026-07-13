"""
seed.py - Inserta historia de ejemplo "La Aventura de Lunita"
"""
from backend.database import get_connection, init_db


def seed_story():
    """Inserta la historia de ejemplo si no existe."""
    init_db()

    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM stories WHERE title = ?", ("La Aventura de Lunita",))
        if cursor.fetchone():
            print("La historia ya existe. Saliendo.")
            return

        cursor.execute("""
            INSERT INTO stories (title, author, cover_color)
            VALUES (?, ?, ?)
        """, ("La Aventura de Lunita", "Prof. Tatiana Quiros", "#1a1a2e"))
        story_id = cursor.lastrowid

        pages = [
            {
                "page_number": 1,
                "image_emoji": "🌙",
                "image_url": "/images/page-1.webp",
                "text": "Había una vez una gatita llamada Lunita que vivía en una casa cerca del bosque. Le gustaba explorar y descubrir cosas nuevas. ¡Esta noche tendrá una aventura especial!",
                "background_color": "#1a1a2e",
                "sounds": [{"sound_type": "music", "sound_url": "/sounds/music.mp3", "position_x": 80, "position_y": 8}]
            },
            {
                "page_number": 2,
                "image_emoji": "🌲",
                "image_url": "/images/page-2.webp",
                "text": "Un día, Lunita decidió explorar el bosque. Escuchó un sonido extraño entre los árboles... ¡era un pajarito cantando feliz! 🐦",
                "background_color": "#2d5a27",
                "sounds": [{"sound_type": "bird", "sound_url": "/sounds/bird.mp3", "position_x": 80, "position_y": 8}]
            },
            {
                "page_number": 3,
                "image_emoji": "💧",
                "image_url": "/images/page-3.webp",
                "text": "Lunita siguió caminando y encontró un río cristalino. El agua hacía un sonido muy relajante. ¡Splash splash!",
                "background_color": "#4a90d9",
                "sounds": [{"sound_type": "water", "sound_url": "/sounds/agua.mp3", "position_x": 80, "position_y": 8}]
            },
            {
                "page_number": 4,
                "image_emoji": "🦉",
                "image_url": "/images/page-4.webp",
                "text": "De pronto, escuchó un ululato. ¡Era Búho Sabio, el más antiguo del bosque! Su sonido resonaba en los árboles: ¡buuuu, buuuu!",
                "background_color": "#1e3a5f",
                "sounds": [{"sound_type": "owl", "sound_url": "/sounds/owl.mp3", "position_x": 80, "position_y": 8}]
            },
            {
                "page_number": 5,
                "image_emoji": "🐕",
                "image_url": "/images/page-5.webp",
                "text": "Un perro muy amigable apareció corriendo por el bosque. ¡Guau guau! Parece que también estaba explorando y haciendo nuevos amigos.",
                "background_color": "#8b6914",
                "sounds": [{"sound_type": "dog", "sound_url": "/sounds/dog.mp3", "position_x": 80, "position_y": 8}]
            },
            {
                "page_number": 6,
                "image_emoji": "🏠",
                "image_url": "/images/page-6.webp",
                "text": "Lunita regresó a casa feliz con muchas historias que contar. ¡Fin! 🎉 ¡Lunita aprendió que explorar es divertidísimo!",
                "background_color": "#ffb347",
                "sounds": [{"sound_type": "applause", "sound_url": "/sounds/applause.mp3", "position_x": 80, "position_y": 8}]
            }
        ]

        for page in pages:
            cursor.execute("""
                INSERT INTO pages (story_id, page_number, image_emoji, image_url, text, background_color)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (story_id, page["page_number"], page["image_emoji"], page["image_url"], page["text"], page["background_color"]))
            page_id = cursor.lastrowid

            for sound in page["sounds"]:
                cursor.execute("""
                    INSERT INTO sounds (page_id, sound_type, sound_url, position_x, position_y)
                    VALUES (?, ?, ?, ?, ?)
                """, (page_id, sound["sound_type"], sound["sound_url"], sound["position_x"], sound["position_y"]))

        conn.commit()
        print("Historia 'La Aventura de Lunita' creada exitosamente con 6 páginas!")


if __name__ == "__main__":
    seed_story()
