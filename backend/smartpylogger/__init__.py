"""
SmartPyLogger - Client for API logging with authentication
"""

__version__ = "0.1.0"
__author__ = "Your Name"

from .client import SmartPyLogger, APIClient, AuthManager
from .logger import LoggingMiddleware, setup_logging_middleware

__all__ = ["SmartPyLogger", "APIClient", "AuthManager", "LoggingMiddleware", "setup_logging_middleware"]
