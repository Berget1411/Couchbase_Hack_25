"""
FastAPI middleware for request/response logging

API ENDPOINTS ACCESSED BY THIS CLIENT:

1. For sending request data to DB:
    requests.post("https://api.com/api/schemas", json=schema)

2. For authorizing usage:
    requests.post(f"{self.api_url}/api/schemas",json=event_data, 
                        headers={"Authorization": f"Bearer {self.api_key}"})
"""

import time
import logging
import json
from typing import Callable
from fastapi import Request, Response
from fastapi.middleware.base import BaseHTTPMiddleware # type: ignore
from starlette.middleware.base import RequestResponseEndpoint


class LoggingMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for comprehensive request/response logging"""

    ### COOL CODE GOES HERE
    pass

def setup_logging_middleware():
    ### COOL SETUP CODE GOES HERE
    pass