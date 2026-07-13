FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY data/ ./data/
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 7000

ENTRYPOINT ["./entrypoint.sh"]
