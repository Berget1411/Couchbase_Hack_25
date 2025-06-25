"""
FastAPI middleware for request/response logging

This logger ONLY sends POST request data to api_server.py
api_server.py handles all database operations and dashboard communication
"""

import subprocess
import os
import platform
from datetime import datetime

import json
import requests
from typing import Dict, Any, Optional

from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.base import RequestResponseEndpoint


API_URL="http://localhost:8000"  ### CHANGE TO EXTERNAL IP LATER

class ClientError(Exception):
    pass

class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware - intercepts requests and sends to api_server.py"""
    
    def __init__(self, app, api_key: str = "", app_id: str = "", allowed_origins: Optional[list[str]] = None):
        """Initialize middleware with API credentials"""

        # Basic configuration
        self.api_key = api_key
        self.app_id = app_id
        self.api_url = API_URL
        self.allowed_origins = allowed_origins or []

        # Validator paths
        self.content_validator_path = ""
        self.ip_validator_path = ""

        super().__init__(app) # Inhereting from BaseHTTPMiddleware


        ### ---- VALIDATE USER ---- ###
        response = requests.post(
            self.api_url + "/api/auth/validate",
            json={"api_key": self.api_key, "app_id": self.app_id}
        )
        print(response.json()["isValid"])
        
        self.auth = response.json()["isValid"] ### Returns true or false

        if self.auth is True:
            print("Valid API key and app_id")
        elif self.auth is False:
            print("Invalid API key or app_id")
            raise HTTPException(
                status_code=401,
                detail="Invalid API key or app_id"
            )
        else:
            print("Unknown error during API key validation")
            raise HTTPException(
                status_code=500,
                detail="Unknown error during API key validation"
            )
        

        ### ---- CHECK USER MACHINE AND PICK EXEC. PATH ---- ###

        current_dir = os.path.dirname(os.path.abspath(__file__))
        system = platform.system().lower()
        try:
            if system == "windows": # Windows
                self.ip_validator_path = os.path.join(current_dir, "validators", "ip_validator_windows.exe")
                self.content_validator_path = os.path.join(current_dir, "validators", "contains_windows.exe")

            elif system == "darwin":  # macOS
                self.ip_validator_path = os.path.join(current_dir, "validators", "ip_validator_mac")
                self.content_validator_path = os.path.join(current_dir, "validators", "contains_mac")

            else:  # linux
                self.ip_validator_path = os.path.join(current_dir, "validators", "ip_validator_linux")
                self.content_validator_path = os.path.join(current_dir, "validators", "contains_linux")

        except Exception as e:
            print(f"Error setting validator paths: {e}")
            raise HTTPException(
                status_code=500,
                detail="Error setting validator paths"
            )

        print(f"You're all set up! Using {system} validators.")
    
    
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

            # 1. IP VALIDATION (fatal, but log first)
            ip_validator_path = self.ip_validator_path
            ip_result = subprocess.run(
                [ip_validator_path, json.dumps(payload)],
                capture_output=True,
                text=True,
                timeout=5
            )
            ip_blocked = ip_result.returncode != 0

            # Optionally, set a special flag for blocked IPs
            if ip_blocked:
                payload["flag"] = 2  # 2 = blocked by IP, 1 = flagged by content, 0 = clean

            # 2. CONTENT VALIDATION (flagging)
            content_validator_path = self.content_validator_path
            content_result = subprocess.run(
                [content_validator_path, json.dumps(payload)],
                capture_output=True,
                text=True,
                timeout=5
            )
            if content_result.returncode == 0:
                try:
                    validated_payload = json.loads(content_result.stdout)
                    payload = validated_payload  # Overwrite with flagged version if needed
                except Exception:
                    pass

            # Only send the POST request once, after all validation
            requests.post(
                self.api_url + "/api/schemas",
                json=payload
            )

            # 4. If IP was blocked, now raise the HTTP error
            if ip_blocked:
                raise HTTPException(
                    status_code=403,
                    detail=f"Request blocked: Unauthorized IP address. {ip_result.stdout.strip()}"
                )

            # 5. Otherwise, continue as normal
            response = await call_next(request)
            return response
        
        elif self.auth == False:
            print("invalid API key")

        else:
            raise ClientError("I dont know")
