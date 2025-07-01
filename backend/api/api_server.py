"""
FastAPI server for SmartPyLogger - handles API requests and database operations
"""

from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import subprocess

from datetime import timedelta
import traceback
from datetime import datetime

import os
from typing import Optional, List, Any, Dict
import json

from couchbase.exceptions import CouchbaseException
from couchbase.auth import PasswordAuthenticator
from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions

from dotenv import load_dotenv


load_dotenv()

### Class and file imports


from query import QueryDB

query_obj = QueryDB() # Initialize query object for database operations

app = FastAPI(title="SmartPyLogger API", version="1.0.0")

# CORS for dashboard connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://dashboard:3000", "https://smartpylogger.vercel.app", "*"], # This is the frontend, used for dev and prod dont hate us
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Couchbase connection
endpoint = os.getenv("CB_CONNECT_STRING")
backup_endpoint = os.getenv("BACKUP_CONNECT_STRING")
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


### ---- CLIENT ENDPOINTS: SmartPyLogger -> API ---- ###

@app.post("/api/schemas")
async def submit_schema(payload: Dict[str, Any]):

    key = payload['timestamp'] + ":" + payload["api_key"] + ":" + str(payload["session_id"])
    
    print(payload)
    print(cb_username, cb_password, cb_bucketname, cb_scope, cb_collection)
    auth = PasswordAuthenticator(cb_username, cb_password) # type: ignore

    options = ClusterOptions(auth)
    options.apply_profile("wan_development")

    try:
        print("SENDING")

        cluster = Cluster(endpoint, options) # type: ignore
        
        # Wait until the cluster is ready for use.
        cluster.wait_until_ready(timedelta(seconds=5))

        # Get a reference to our bucket
        cb = cluster.bucket(cb_bucketname)

        # Get a reference to our collection
        cb_coll = cb.scope(cb_scope).collection(cb_collection) # type: ignore

        # Simple K-V operation - to create a document with specific ID
        try:
            result = cb_coll.insert(key, payload)
            print("\nCreate document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)

        """
        # Simple K-V operation - to retrieve a document by ID
        try:
            result = cb_coll.get(key)
            print("\nFetch document success. Result: ", result.content_as[dict])
        except CouchbaseException as e:
            print(e)
          
        try:
            payload["name"] = "Couchbase Airways!!"
            result = cb_coll.replace(key, payload)
            print("\nUpdate document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)
            
        # Simple K-V operation - to delete a document by ID

        try:
            result = cb_coll.remove(key)
            print("\nDelete document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)
        """
        
    except Exception as e:
        
        # backup endpoint
        print("SENDING")
        cluster = Cluster(backup_endpoint, options) # type: ignore

        # Wait until the cluster is ready for use.
        cluster.wait_until_ready(timedelta(seconds=5))

        # Get a reference to our bucket
        cb = cluster.bucket(cb_bucketname)

        # Get a reference to our collection
        cb_coll = cb.scope(cb_scope).collection(cb_collection) # type: ignore

        # Simple K-V operation - to create a document with specific ID
        try:
            result = cb_coll.insert(key, payload)
            print("\nCreate document success. CAS: ", result.cas)
        except CouchbaseException as e:
            print(e)


@app.post("/api/auth/validate")
async def validate_api_key_client(auth_dict: Dict[str, Any]):
    """
    Validate API key and return user info.
    Essentially just checks w frontend if user is registered.
    """

    response = requests.post("https://smartpylogger.vercel.app/api/validate-api-key", json=auth_dict) # This feels fine

    print(response.json)

    response_val = response.json()["appSessionId"]  # Get session ID from response

    #print(response_val)
    # print(type(response_val))

    return {"app_session_id": response_val} # True or false


### ---- DASHBOARD ENDPOINTS: Dashboard -> API ---- ###

@app.post("/dashboard/send-requests")
async def push_selected_requests_response(query_dict: Dict[str, Any]):
    try:
        repo_url = query_dict["repo_url"]
        user_query = query_dict["user_query"]
        input_requests = query_dict.get("input_requests", [])
        
        print(f"Analyzing repo: {repo_url}")
        print(f"Query: {user_query}")
        print(f"Input requests: {input_requests}")
        
        # Call the analysis script
        result = subprocess.run(
            [
                "python3", "analyze_repo.py", repo_url, user_query, *input_requests
            ],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__)),  # Ensure correct working directory
            check=False  # Don't raise exception on non-zero exit
        )
        
        print(f"Return code: {result.returncode}")
        print(f"STDOUT: {result.stdout}")
        print(f"STDERR: {result.stderr}")
        
        if result.returncode != 0:
            return {
                "error": f"Script failed with return code {result.returncode}",
                "stderr": result.stderr,
                "stdout": result.stdout,
                "question_rephrase": f"Error analyzing: {user_query}",
                "Code snippet": "Script execution failed",
                "proposed_fix": f"Script error: {result.stderr}"
            }
        
        # Parse the JSON response
        raw_output = result.stdout.strip()

        # Remove everything before the first '{'
        json_start = raw_output.find('{')
        if json_start != -1:
            json_str = raw_output[json_start:]
        else:
            json_str = raw_output

        try:
            parsed_result = json.loads(json_str)
            print("Parsed JSON:", parsed_result)
            return parsed_result
        except json.JSONDecodeError as e:
            return {
                "error": "Failed to parse JSON response",
                "raw_output": raw_output,
                "question_rephrase": f"Error analyzing: {user_query}",
                "Code snippet": "No code snippet available due to parsing error",
                "proposed_fix": "Unable to provide fix due to response parsing error"
            }
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        traceback.print_exc()
        return {
            "error": f"Unexpected error: {str(e)}",
            "question_rephrase": f"Error analyzing: {query_dict.get('user_query', 'unknown')}",
            "Code snippet": "Unexpected error occurred",
            "proposed_fix": f"Server error: {str(e)}"
        }

@app.post("/dashboard/git-inference")
async def git_inference(query_dict: Dict[str, Any]):
    """Take output of smol-dev, ingest github repo and relevant files and generate a PR for a proposed fix on that repo."""
    pass


@app.post("/dashboard/push-new-requests")
async def push_new_requests_to_frontend(request_dict: Dict[str, Any]):
    """
    Push new request rows to frontend for real-time updates.
    Called when new requests arrive from SmartPyLogger clients.
    """

    # Request dict will contain session_id, and num_rows
    print(f"Received request: {request_dict}")

    returned_list_dict = query_obj.get_requests_by_ids(
        session_id=request_dict["session_id"],
        requests_per_session=request_dict["num_rows"]
    )
    print(f"Returning {len(returned_list_dict)} results")
    return returned_list_dict


# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    pass

@app.get("/debug/list-documents")
async def debug_list_documents(limit: int = 10):
    """Debug endpoint to list all documents in the database"""
    return query_obj.debug_list_all_documents(limit)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
