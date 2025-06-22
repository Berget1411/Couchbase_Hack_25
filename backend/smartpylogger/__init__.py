"""
SmartPyLogger - FastAPI middleware for comprehensive request/response logging
"""

__version__ = "0.1.0"
__author__ = "Your Name"

from .logger import LoggingMiddleware, setup_logging_middleware

__all__ = ["LoggingMiddleware", "setup_logging_middleware"]
