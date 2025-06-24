"""
FastAPI server for SmartPyLogger - handles API requests and database operations
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os
from typing import Optional, List, Any
import json

### Other class and file imports
from client import Utils
from infer import LLM
from query import QueryDB

app = FastAPI(title="SmartPyLogger API", version="1.0.0")

# CORS for dashboard connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://dashboard:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    """Get PostgreSQL database connection"""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        database=os.getenv("DB_NAME", "smartpylogger_db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "admin"),
        port=os.getenv("DB_PORT", "5432")
    )

### ---- Pydantic models for typesafety ---- ###
class SchemaData(BaseModel):
    request_data: dict

class DashboardRequest(BaseModel):
    user_id: str
    api_key: str
    request_ids: Optional[List[int]] # Selected rows
    chat_message: Optional[str] # LLM analysis request

class UserRegistration(BaseModel):
    ### Unsure which fields are needed here, well figure out when we get schema done
    username: str
    email: str
    api_key: str
    user_id: str

class PushNewRequests(BaseModel):
    user_id: str
    api_key: str


### ---- CLIENT ENDPOINTS: SmartPyLogger -> API ---- ###

@app.post("/api/schemas")
async def submit_schema(schema_data: SchemaData, api_key: str = Header(...)):
    """
    Receive schema from SmartPyLogger client and store in database
    """
    pass

@app.post("/api/auth/validate")
async def validate_api_key_client(api_key: str):
    """
    Validate API key and return user info.
    Essentially just checks w frontend if user is registered.
    """
    pass


### ---- DASHBOARD ENDPOINTS: Dashboard -> API ---- ###

@app.post("/dashboard/register-user")
async def register_user_from_dashboard(user_data: UserRegistration):
    """
    Sync user with backend requests db. Adding new user_id in the user_id col or api_key instead
    """
    pass

@app.post("/dashboard/send-requests")
async def push_selected_requests_response(request: DashboardRequest):
    """
    Unified endpoint for dashboard requests:
    - No request_ids + no chat_message = Return no requests
    - With request_ids + no chat_message = Feed to LLM and revert to standard prompt to summarize what they are likely to mean  
    - With request_ids + chat_message = Return selected requests + LLM analysis with regard to ur query
    """

    llm = LLM()
    query_db = QueryDB()

    queried_requests: list[dict[str, Any]] = []

    if request.request_ids is not None:
        queried_requests = query_db.get_requests_by_ids(
            api_key=request.api_key,
            request_ids=request.request_ids
        )

    context_str = json.dumps(queried_requests)

    if request.chat_message is not None:
        llm.get_response(query=request.chat_message, context=context_str)
    else:
        llm.get_response(query="The user did not ask for anything particular. Summarize the requests below: ", context=context_str)

@app.post("/dashboard/push-new-requests")
async def push_new_requests_to_frontend(request: PushNewRequests):
    """
    Push new request rows to frontend for real-time updates.
    Called when new requests arrive from SmartPyLogger clients.
    """
    pass

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    pass


### OBS AROUND HERE IMPORT DB HELPER FNS FROM CLIENT.PY

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)