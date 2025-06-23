"""
FastAPI server for SmartPyLogger - handles API requests and database operations
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os

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

### ---- Pydantic models for typesafety SER DU LUDVIG PYTHON KAN VISST VA TYPESAFE ---- ###
# SchemaData is the data from the SmartPyLogger client
class SchemaData(BaseModel):
    request_data: dict

# DashboardRequest is the data from the dashboard
class DashboardRequest(BaseModel):
    user_id: str
    api_key: str

# ChatMessage is the data from the chatbot
class ChatMessage(BaseModel):
    message: str
    user_id: str
    api_key: str

class UserRegistration(BaseModel):
    ### Unsure which fields are needed here, well figure out when we get schema done
    username: str
    email: str
    api_key: str
    user_id: str

### ---- CLIENT ENDPOINTS: SmartPyLogger -> API ---- ###

@app.post("/api/schemas")
async def submit_schema(schema_data: SchemaData, api_key: str = Header(...)):
    """Receive schema from SmartPyLogger client and store in database"""
    pass

@app.post("/api/auth/validate")
async def validate_api_key_client(api_key: str):
    """Validate API key and return user info"""
    pass


### ---- DASHBOARD ENDPOINTS: Dashboard -> API ---- ###

@app.post("/dashboard/requests")
async def get_user_requests(request: DashboardRequest):
    """Get requests for specific user (dashboard calls this)"""
    pass

@app.post("/dashboard/chat/message")
async def chat_message(message: ChatMessage):
    """Handle chatbot messages from dashboard"""
    pass

@app.get("/dashboard/users")
async def get_users():
    """Get all users (for dashboard admin)"""
    pass

### ---- DASHBOARD DB CONNECTION + USER SYNC ---- ###

@app.post("/dashboard/register-user")
async def register_user_from_dashboard(user_data: dict):
    """
    Sync user with backend requests db.
    """
    pass

"""
User sync flow:

Dashboard Registration -> POST /dashboard/register-user -> Backend Database (new user id for requests)
                                    I
User gets API key -> SmartPyLogger uses API key -> Requests stored with user_id
"""

@app.post("/dashboard/send-requests")
async def push_requests_to_dashboard(user_id: str, api_key: str):
    """
    Send request data TO THE FUCKING dashboard.
    
    Accesses the requests db type shit and sends to dashboard for display.
    """
    pass

"""
Data flow:

SmartPyLogger -> POST /api/schemas -> Database
                                    I
Dashboard -> POST /dashboard/send-requests <- API Server (gets data from DB)
"""


# Health checkinggggg
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)