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
from fastapi import Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware # type: ignore
from starlette.middleware.base import RequestResponseEndpoint

API_URL="http://localhost:8000"  ### CHANGE TO EXTERNAL IP LATER

class ClientError(Exception):
    pass

class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware - intercepts requests and sends to api_server.py"""
    
    def __init__(self, app, api_key: str = ""):
        """Initialize middleware with API credentials"""
        self.api_key = api_key
        self.api_url = API_URL
        super().__init__(app) # Inhereting from BaseHTTPMiddleware

        ### Validate user RETURNS TRUE OR FALSE
        self.auth = requests.post(
            self.api_url + "/api/auth/validate",
            json={"api_key": self.api_key}
        )
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response: # type: ignore
        if self.auth is True:
            """Intercept request/response and send to api_server.py"""
            # Read the request body & load to JSON to send off to API
            body = await request.body()

            try:
                body_dict = json.loads(body)
            except Exception:
                body_dict = {} 

            requests.post(
                self.api_url + "/api/schemas",
                json=body_dict,
                headers={"api_key": self.api_key}
            )

            response = await call_next(request)
            
            return response
        
        else:
            raise ClientError("Invalid API key. Skill issue. If you're broke just say thaaaaat.")
