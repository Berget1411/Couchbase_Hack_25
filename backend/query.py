"""
Database query functions for SmartPyLogger backend
"""

import psycopg2
import json
import os
from string import Template
from typing import List, Dict, Any, Optional

from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions, QueryOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import CouchbaseException

class QueryDB():
    def __init__(self):
        
        self.endpoint = "couchbases://cb.82kuz4rgjdzyhlh.cloud.couchbase.com"
        self.user = os.getenv("CB_USER")
        self.password = os.getenv("CB_PASSWORD")
        self.bucket = os.getenv("BUCKET_NAME")
        self.scope = os.getenv("SCOPE_NAME")
        self.collect = os.getenv("COLLECTION_NAME")

    def get_requests_by_ids(self, app_id: str, api_key: str) -> List[Dict[str, Any]]:
        """
        Query PostgreSQL for specific request rows by their IDs.
        
        Args:
            request_ids: List of request IDs to fetch (rows)
            user_id: User ID for security (only fetch user's own requests)
        
        Returns:
            List of request dictionaries with full data
        """

        cluster = Cluster.connect(
            self.endpoint,
            ClusterOptions(PasswordAuthenticator(self.user, self.password)))
        bucket = cluster.bucket(self.bucket)
        collection = bucket.scope(self.scope).collection(self.collect)

        try:

            result = cluster.query(
                f"""SELECT *
                FROM "{self.bucket}"
                WHERE app_id = "{app_id}" 
                AND api_key = "{api_key}"
                ORDER BY timestamp DESC
                LIMIT 50;"""
            )

            return result
            
        except Exception as e:
            print(f"Database query error: {e}")
            return []


    def get_all_user_requests(user_id: str, limit: int = 100) -> list[dict[str, Any]]: # type: ignore
        pass
            