FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential git curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Install Node.js for building the web UI
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy web UI source
COPY webui /app/webui

# Build web UI
WORKDIR /app/webui
RUN npm install && npm run build

# Copy backend & worker code
WORKDIR /app
COPY backend /app/backend
COPY worker /app/worker
COPY webui/dist /app/webui_dist

# non-root user
RUN useradd -u 1000 -m appuser || true
USER 1000

ENV MODEL_DIR=/models
EXPOSE 80
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "80", "--proxy-headers"]
