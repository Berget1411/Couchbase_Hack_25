"""
FastAPI middleware for request/response logging

This logger ONLY sends POST request data to api_server.py
api_server.py handles all database operations and dashboard communication
"""

import time
import logging
import json
import requests
from typing import Dict, Any, Optional
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.base import RequestResponseEndpoint
from datetime import datetime

API_URL="http://localhost:8000"  ### CHANGE TO EXTERNAL IP LATER

class ClientError(Exception):
    pass

class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware - intercepts requests and sends to api_server.py"""
    
    def __init__(self, app, api_key: str = "", app_id: str = "", allowed_origins: Optional[list[str]] = None):
        """Initialize middleware with API credentials"""
        self.api_key = api_key
        self.app_id = app_id
        self.api_url = API_URL
        self.allowed_origins = allowed_origins or []
        super().__init__(app) # Inhereting from BaseHTTPMiddleware

        ### Validate user RETURNS TRUE OR FALSE
        response = requests.post(
            self.api_url + "/api/auth/validate",
            json={"api_key": self.api_key, "app_id": self.app_id}
        )
        print(response.json()["isValid"])
        
        self.auth = response.json()["isValid"]
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response: # type: ignore
        if self.auth is True:
            """Intercept request/response and send to api_server.py"""
            # Read the request body & load to JSON to send off to API
            body = await request.body()
            sender_ip = request.client.host # type: ignore
            request_method = request.method
            timestamp = datetime.now().strftime("%Y/%m/%d")

            try:
                body_dict = json.loads(body)
            except Exception:
                body_dict = {}

            # Wrap it for the /api/schemas endpoint
            payload = {"api_key":self.api_key,
                       "app_id":self.app_id,
                       "request_method": request_method, 
                       "request_data": body_dict,
                       "allowed_origins": self.allowed_origins,
                       "sender_ip": sender_ip,
                       "timestamp": timestamp,
                       "flag": 0}
            
            print("Payload being sent to /api/schemas:", payload)

            requests.post(
                self.api_url + "/api/schemas",
                json=payload
            )
            
            # Check if request_data contains unwanted content
            if not payload["request_data"]["foo"] == "bar":
                print("Payload did not match expected format")
                # Block the request by raising an HTTPException
                raise HTTPException(
                    status_code=400, 
                    detail="Request blocked: Invalid payload format"
                )
            
            # If payload is valid, continue with the request
            response = await call_next(request)
            return response
        
        elif self.auth == False:
            print("invalid API key")

        else:
            raise ClientError("I dont know")
