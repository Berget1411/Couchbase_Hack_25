"""
FastAPI server for SmartPyLogger - handles API requests and database operations
"""

from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from datetime import timedelta
import traceback
from datetime import datetime

import psycopg2
import os
from typing import Optional, List, Any, Dict
import json

from couchbase.exceptions import CouchbaseException
from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions

from dotenv import load_dotenv

load_dotenv()

### Other class and file imports
from client import Utils
from infer import LLM
from query import QueryDB

app = FastAPI(title="SmartPyLogger API", version="1.0.0")

# CORS for dashboard connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://dashboard:3000", ""],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Couchbase connection
endpoint = "couchbases://cb.82kuz4rgjdzyhlh.cloud.couchbase.com"
cb_username = os.getenv("CB_USER")
cb_password = os.getenv("CB_PASSWORD")
cb_bucketname = os.getenv("BUCKET_NAME")
cb_scope = os.getenv("SCOPE_NAME")
cb_collection = os.getenv("COLLECTION_NAME")

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
    valid_data:dict

class PushNewRequests(BaseModel):
    api_key: str # I dont know what he wants to send me


### ---- CLIENT ENDPOINTS: SmartPyLogger -> API ---- ###

@app.post("/api/schemas")
async def submit_schema(payload: Dict[str, Any]):
    """
    payload = {
	"type": "airline",
	"id": 8091,
	"callsign": "CBS",
	"iata": None,
	"icao": None,
	"name": "Couchbase Airways",
    }
    """
    
    ### CALL A SNIFFER FUNCTION TO LOOK AT THE PAYLOAD AND VALIDATE IF ITS HAZARDOUS OR NOT

    key = payload['timestamp'] + ":" + payload["api_key"] + ":" + payload["app_id"]
    
    print(payload)

    auth = PasswordAuthenticator(cb_username, cb_password)

    options = ClusterOptions(auth)
    options.apply_profile("wan_development")

    try:
        
        cluster = Cluster(endpoint, options)
        # Wait until the cluster is ready for use.
        cluster.wait_until_ready(timedelta(seconds=5))
        # Get a reference to our bucket
        cb = cluster.bucket(cb_bucketname)
        # Get a reference to our collection
        cb_coll = cb.scope(cb_scope).collection(cb_collection)
        # Simple K-V operation - to create a document with specific ID
        try:
            result = cb_coll.insert(key, payload)
            print("\nCreate document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)
        # Simple K-V operation - to retrieve a document by ID
        try:
            result = cb_coll.get(key)
            print("\nFetch document success. Result: ", result.content_as[dict])
        except CouchbaseException as e:
            print(e)
        # Simple K-V operation - to update a document by ID
        try:
            payload["name"] = "Couchbase Airways!!"
            result = cb_coll.replace(key, payload)
            print("\nUpdate document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)
            
        # Simple K-V operation - to delete a document by ID

        """
        try:
            result = cb_coll.remove(key)
            print("\nDelete document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)
        """
        
    
    ### MAKE SURE TO CLEAR OLD DB ENTRIES

    except Exception as e:
        traceback.print_exc()

@app.post("/api/auth/validate")
async def validate_api_key_client(auth_dict: Dict[str, Any]):
    """
    Validate API key and return user info.
    Essentially just checks w frontend if user is registered.
    """
    # print(api_key)

    response = requests.post("http://localhost:3000/api/validate-api-key", json=auth_dict)
    # print(type(valbool.json()))
    print(response.json())
    response_val = response.json()["isValid"]
    print(type(response_val))

    return {"isValid": response_val} # True or false


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
    # api_key_query = 
    ### Find all shits in db
    result_dict = {}

    requests.post(url="http://localhost:3000/", json=result_dict) # I don't know the url and endpoint

    pass

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    pass


### OBS AROUND HERE IMPORT DB HELPER FNS FROM CLIENT.PY

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")