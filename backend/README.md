# SmartPyLogger

FastAPI middleware for comprehensive request/response logging.

## Installation

```bash
pip install -e .
```

## Usage

```python
from fastapi import FastAPI
from smartpylogger import setup_logging_middleware

app = FastAPI()

# Add logging middleware
setup_logging_middleware(app, logger_name="my_api_logger")

@app.get("/users")
async def get_users():
    return {"users": ["John", "Jane"]}

@app.post("/users")
async def create_user(user_data: dict):
    return {"message": "User created", "data": user_data}
```

## What it logs:

- **Request details**: Method, URL, headers, client IP, user agent
- **Request body**: For POST/PUT/PATCH requests
- **Response details**: Status code, headers, processing time
- **Timing**: Request processing time in milliseconds

## Example log output:

```
2024-01-15 10:30:15,123 - api_logger - INFO - REQUEST: {
  "method": "POST",
  "url": "http://localhost:8000/users",
  "headers": {...},
  "client_ip": "127.0.0.1",
  "user_agent": "Mozilla/5.0...",
  "body": "{\"name\": \"John\"}"
}

2024-01-15 10:30:15,145 - api_logger - INFO - RESPONSE: {
  "status_code": 200,
  "headers": {...},
  "process_time_ms": 22.5
}
``` 