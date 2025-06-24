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


class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware - intercepts requests and sends to api_server.py"""
    
    def __init__(self, app, api_key: str = "", api_url: str = API_URL):
        """Initialize middleware with API credentials"""
        pass
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response: # type: ignore
        """Intercept request/response and send to api_server.py"""
        # Read the request body & load to JSON to send off to API
        body = await request.body()

        try:
            body_dict = json.loads(body)
        except Exception:
            body_dict = {} 

        requests.post(API_URL + "/schemas", json=body_dict)

        response = await call_next(request)
        
        return response
    
    async def _send_to_api_server(self, request: Request, response: Response, process_time: float):
        """Send request data to api_server.py endpoint: POST /api/schemas"""
        pass


def setup_logging_middleware(app, api_key: str = "", api_url: str = API_URL):
    """Add logging middleware to FastAPI app"""
    pass
