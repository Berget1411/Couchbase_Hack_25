from smartpylogger import LoggingMiddleware
from fastapi import FastAPI, Request
import requests

app = FastAPI()

app.add_middleware(
    LoggingMiddleware,
    api_key="4806ae52-5ba5-401f-9622-6f3a31483287",  # This is where the middleware would forward, but the app itself runs on 8500
    allowed_origins=["127.0.0.1"],
)

API_URL = "http://localhost:8500"

@app.post("/mock")
async def mock_post(request: Request):
    data = await request.json()
    return {"received": data}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8500)