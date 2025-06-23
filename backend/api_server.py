from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import psycopg2
import os
import dotenv

app = FastAPI()

# CORS for connecting to dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Our dashboard link CHANGE TO VERCEL LATER
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Establishing DB connection fir the 2 tables (1) user auth and (2) sending requests
def get_db():
    return psycopg2.connect(
        host=os.environ["DATABASE_URL"],
        database="dashboard_db",
        user="admin",
        password="admin"
    )

### ---- CLIENT ENDPOINTS: SmartPyLogger -> API ---- ###

@app.post("/api/auth/validate")
async def validate_api_key_client(api_key: str):
    # Validates SmartPyLogger API keys
    # Will probably call a client.py fn and iterate thru rows in user table
    return {"valid": True}

@app.post("/api/schemas")
async def submit_schema(schema_data: dict):
    # Receives schemas FROM SmartPyLogger packages
    # Stores in database
    return {"status": "success"}


### ---- DASHBOARD ENDPOINTS: Dashboard -> API ---- ###

### Probably want this to be a background async fn for performance since its the most called endpoint
@app.get("/dashboard/schemas")
async def get_schemas():
    # Dashboard gets schemas to display
    return {"schemas": []}

@app.post("/dashboard/chat/message")
async def chat_message(message: dict):
    # Dashboard sends chat messages
    return {"response": "AI response"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)