"""
seed.py - Inserta historia de ejemplo "La Aventura de Lunita"
"""
from database import get_connection, init_db


def seed_story():
    """Inserta la historia de ejemplo si no existe."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM stories WHERE title = ?", ("La Aventura de Lunita",))
    if cursor.fetchone():
        print("La historia ya existe. Saliendo.")
        conn.close()
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
            "text": "Había una vez una gatita llamada Lunita que vivía en una casa cerca del bosque. Le gustaba explorar y descubrir cosas nuevas. ¡Esta noche tendrá una aventura especial!",
            "background_color": "#1a1a2e",
            "sounds": [{"sound_type": "music", "position_x": 80, "position_y": 20}]
        },
        {
            "page_number": 2,
            "image_emoji": "🌲",
            "text": "Un día, Lunita decidió explorar el bosque. Escuchó un sonido extraño entre los árboles... ¡era un pajarito cantando feliz! 🐦",
            "background_color": "#2d5a27",
            "sounds": [{"sound_type": "bird", "position_x": 70, "position_y": 40}]
        },
        {
            "page_number": 3,
            "image_emoji": "💧",
            "text": "Lunita siguió caminando y encontró un río cristalino. El agua hacía un sonido muy relajante. ¡Splash splash!",
            "background_color": "#4a90d9",
            "sounds": [{"sound_type": "water", "position_x": 50, "position_y": 70}]
        },
        {
            "page_number": 4,
            "image_emoji": "🦉",
            "text": "De pronto, escuchó un ululato. ¡Era Búho Sabio, el más antiguo del bosque! Su sonido resonaba en los árboles: ¡buuuu, buuuu!",
            "background_color": "#1e3a5f",
            "sounds": [{"sound_type": "owl", "position_x": 30, "position_y": 30}]
        },
        {
            "page_number": 5,
            "image_emoji": "🐕",
            "text": "Un perro muy amigable apareció corriendo por el bosque. ¡Guau guau! Parece que también estaba explorando y haciendo nuevos amigos.",
            "background_color": "#8b6914",
            "sounds": [{"sound_type": "dog", "position_x": 60, "position_y": 50}]
        },
        {
            "page_number": 6,
            "image_emoji": "🏠",
            "text": "Lunita regresó a casa feliz con muchas historias que contar. ¡Fin! 🎉 ¡Lunita aprendió que explorar es divertidísimo!",
            "background_color": "#ffb347",
            "sounds": [{"sound_type": "applause", "position_x": 50, "position_y": 50}]
        }
    ]

    for page in pages:
        cursor.execute("""
            INSERT INTO pages (story_id, page_number, image_emoji, text, background_color)
            VALUES (?, ?, ?, ?, ?)
        """, (story_id, page["page_number"], page["image_emoji"], page["text"], page["background_color"]))
        page_id = cursor.lastrowid

        for sound in page["sounds"]:
            cursor.execute("""
                INSERT INTO sounds (page_id, sound_type, position_x, position_y)
                VALUES (?, ?, ?, ?)
            """, (page_id, sound["sound_type"], sound["position_x"], sound["position_y"]))

    conn.commit()
    conn.close()
    print("Historia 'La Aventura de Lunita' creada exitosamente con 6 páginas!")


if __name__ == "__main__":
    seed_story()
