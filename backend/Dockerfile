FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy fixture data (lives at repo root /data/fixtures/, copied during CI or build)
# If data/ doesn't exist yet, create the expected directory structure
RUN mkdir -p /app/data/fixtures

ENV PORT=8000
EXPOSE ${PORT}

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
