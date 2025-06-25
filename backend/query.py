"""
Database query functions for SmartPyLogger backend
"""

import psycopg2
import json
import os
from string import Template
from typing import List, Dict, Any, Optional
from collections import defaultdict

from couchbase.cluster import Cluster
from couchbase.options import ClusterOptions, QueryOptions
from couchbase.auth import PasswordAuthenticator
from couchbase.exceptions import CouchbaseException

from dotenv import load_dotenv

load_dotenv()

class QueryDB():
    def __init__(self):
        
        self.endpoint = "couchbases://cb.82kuz4rgjdzyhlh.cloud.couchbase.com"
        self.user = os.getenv("CB_USER")
        self.password = os.getenv("CB_PASSWORD")
        self.bucket = os.getenv("BUCKET_NAME")
        self.scope = os.getenv("SCOPE_NAME")
        self.collect = os.getenv("COLLECTION_NAME")

    def get_requests_by_ids(self, session_id: str, requests_per_session: int) -> list[dict]:
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

            per_sesh_query = f"""
                SELECT *
                FROM `{self.bucket}`.`{self.scope}`.`{self.collect}`
                WHERE session_id = $session_id
                ORDER BY timestamp DESC
                LIMIT $number;
                """
                
            result = cluster.query(per_sesh_query, QueryOptions(named_parameters={
                "session_id": session_id,
                "number": requests_per_session
            }))

            json_list = [row for row in result]

            return json_list
            
        except Exception as e:
            print(f"Database query error: {e}")
            return []


    def get_all_user_requests(user_id: str, limit: int = 100) -> list[dict[str, Any]]: # type: ignore
        pass
            

if __name__ == "__main__":

    yabadabadu = QueryDB()
    yaba = yabadabadu.get_requests_by_ids("4806ae52-5ba5-401f-9622-6f3a31483287", 5)
    for row in yaba.keys():
        print(yaba[row])