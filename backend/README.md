# SmartPyLogger

FastAPI middleware for comprehensive request/response logging.

## Installation

```bash
pip install -e .
```

## Dream Usage

```python
from fastapi import FastAPI
from smartpylogger import setup_logging_middleware

app = FastAPI()

# Add logging middleware
setup_logging_middleware(app, logger_name="my_api_logger")

# All ur vibe coded bullshit ass endpoints:
@app.get("/users")
async def get_users():
    return {"users": ["John", "Jane"]}

@app.post("/users")
async def create_user(user_data: dict):
    return {"message": "User created", "data": user_data}
```

## What it logs:

- **Request details**: Nothing yet
