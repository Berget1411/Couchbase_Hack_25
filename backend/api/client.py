"""

Pretty much a utils file for random stuffs

"""

import requests
from typing import Dict, Any, Optional

class Utils():
    def __init__(self):
        self.api_key=""

    def validate_api_key(self, api_key) -> str:  # type: ignore
        """Validate API key and return user_id"""
        self.api_key=api_key
        
        pass

    def init_database(self):
        """Initialize database tables"""
        pass