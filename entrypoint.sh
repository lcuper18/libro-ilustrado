#!/bin/bash
set -e

# Seed database if empty
cd /app
python -c "
from backend.database import get_connection
conn = get_connection().__enter__()
cur = conn.cursor()
cur.execute('SELECT COUNT(*) FROM stories')
count = cur.fetchone()[0]
conn.close()
if count == 0:
    import sys
    sys.exit(1)
" || {
    echo "Database empty, seeding..."
    python backend/seed.py
}

exec uvicorn backend.main:app --host 0.0.0.0 --port 7000
