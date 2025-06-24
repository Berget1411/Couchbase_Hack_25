# backend/smartpylogger/__init__.py

# Version (optional, but good practice)
__version__ = "0.1.0"

# Import and expose your main classes/functions
from .logger import LoggingMiddleware
from .utils import *  # if you want to expose all utils

# Define what is available for import *
__all__ = ["LoggingMiddleware", "SmartPyLogger"]

"""
SmartPyLogger

Usage:
    from fastapi import FastAPI
    from smartpylogger import LoggingMiddleware

    app = FastAPI()
    app.add_middleware(
        LoggingMiddleware,
        api_key="YOUR_API_KEY",
        api_url="https://your-api-server.com"
    )
"""
