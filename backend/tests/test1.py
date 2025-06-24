from smartpylogger import LoggingMiddleware
from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    LoggingMiddleware
)

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)