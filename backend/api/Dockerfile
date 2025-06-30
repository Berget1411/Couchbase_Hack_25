# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for psycopg2 and other packages)
RUN apt-get update && \
    apt-get install -y gcc g++ curl && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=1.7.1
RUN pip install "poetry==$POETRY_VERSION"

# Copy only the developer subrepo for poetry install
COPY developer /app/developer

WORKDIR /app/developer
RUN poetry lock && poetry install --no-root

# Copy the rest of the API code
WORKDIR /app
COPY . .

# Install production requirements (if needed)
RUN pip install --no-cache-dir -r requirements.prod.txt

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the API server with uvicorn for production
CMD ["uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "8000"] 