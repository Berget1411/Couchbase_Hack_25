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
        
        self.endpoint = os.getenv("CB_CONNECT_STRING")
        self.endpoint_backup = os.getenv("BACKUP_CONNECT_STRING")
        self.user = os.getenv("CB_USER")
        self.password = os.getenv("CB_PASSWORD")
        self.bucket = os.getenv("BUCKET_NAME")
        self.scope = os.getenv("SCOPE_NAME")
        self.collect = os.getenv("COLLECTION_NAME")

    def get_requests_by_ids(self, session_id: str, requests_per_session: int) -> list[dict]:
        """
        Query Couchbase for specific request rows by their session_id.
        Note: Data is stored as key-value documents, not as structured records.
        
        Args:
            session_id: Session ID to filter by (string)
            requests_per_session: Number of requests to return
        
        Returns:
            List of request dictionaries with full data
        """

        #try:
        # Main try
        cluster = Cluster.connect(
        self.endpoint,
        ClusterOptions(PasswordAuthenticator(self.user, self.password))) # type: ignore

        bucket = cluster.bucket(self.bucket)
        collection = bucket.scope(self.scope).collection(self.collect) # type: ignore
        """
        except Exception as e:
            # backup bucket
            cluster = Cluster.connect(
                self.endpoint_backup,
                ClusterOptions(PasswordAuthenticator(self.user, self.password))) # type: ignore

            bucket = cluster.bucket(self.bucket)
            collection = bucket.scope(self.scope).collection(self.collect) # type: ignore
        """

        try:
            print(f"Querying for session_id: {session_id}, limit: {requests_per_session}")
            print(f"Database info - bucket: {self.bucket}, scope: {self.scope}, collection: {self.collect}")

            # First approach: Query by session_id field in document content
            per_sesh_query = f"""
                SELECT META().id as doc_id, *
                FROM `{self.bucket}`.`{self.scope}`.`{self.collect}`
                WHERE session_id = $session_id
                ORDER BY timestamp DESC
                LIMIT $number;
                """
                
            result = cluster.query(per_sesh_query, QueryOptions(named_parameters={
                "session_id": session_id,
                "number": requests_per_session
            }))

            print(result)
            print(result.rows())
            print(row for row in result)
            json_list = [row for row in result]
            print(f"Structured query returned {len(json_list)} results")
            
            # Second approach: Look for documents where the key contains the session_id
            if not json_list:
                print("Trying alternative query approach (key pattern)...")
                alt_query = f"""
                    SELECT META().id as doc_id, *
                    FROM `{self.bucket}`.`{self.scope}`.`{self.collect}`
                    WHERE META().id LIKE '%:{session_id}'
                    ORDER BY timestamp DESC
                    LIMIT $number;
                    """
                
                result = cluster.query(alt_query, QueryOptions(named_parameters={
                    "number": requests_per_session
                }))
                
                json_list = [row for row in result]
                print(f"Key pattern query returned {len(json_list)} results")
            
            # Third approach: Get all documents and filter in Python (last resort)
            if not json_list:
                print("Trying Python filtering approach...")
                all_docs_query = f"""
                    SELECT META().id as doc_id, *
                    FROM `{self.bucket}`.`{self.scope}`.`{self.collect}`
                    ORDER BY timestamp DESC
                    LIMIT 100;
                    """
                
                result = cluster.query(all_docs_query)
                all_docs = [row for row in result]
                print(f"Retrieved {len(all_docs)} total documents for filtering")
                
                # Filter by session_id in Python
                filtered_docs = []
                for doc in all_docs:
                    doc_session_id = doc.get('session_id')
                    doc_id = doc.get('doc_id', '')
                    
                    print(f"Checking doc: session_id={doc_session_id} (type: {type(doc_session_id)}), doc_id={doc_id}")
                    
                    # Check if session_id exists in the document content (exact match)
                    if doc_session_id == session_id:
                        print(f"Found exact match: {doc_session_id}")
                        filtered_docs.append(doc)
                    # Check string version of session_id
                    elif str(doc_session_id) == session_id:
                        print(f"Found string match: {doc_session_id}")
                        filtered_docs.append(doc)
                    # Check if the document key ends with the session_id
                    elif doc_id.endswith(f':{session_id}'):
                        print(f"Found key match: {doc_id}")
                        filtered_docs.append(doc)
                    
                    if len(filtered_docs) >= requests_per_session:
                        break
                
                json_list = filtered_docs
                print(f"Python filtering returned {len(json_list)} results")

            return json_list
            
        except Exception as e:
            print(f"Database query error: {e}")
            import traceback
            traceback.print_exc()
            return []

    def get_all_user_requests(self, user_id: str, limit: int = 100) -> list[dict[str, Any]]: # type: ignore
        pass

    def debug_list_all_documents(self, limit: int = 10) -> list[dict]:
        """
        Debug method to list all documents in the collection.
        Use this to understand the actual data structure.
        """
        cluster = Cluster.connect(
            self.endpoint,
            ClusterOptions(PasswordAuthenticator(self.user, self.password)))
        
        try:
            query = f"""
                SELECT META().id as doc_id, *
                FROM `{self.bucket}`.`{self.scope}`.`{self.collect}`
                LIMIT $limit;
                """
            
            result = cluster.query(query, QueryOptions(named_parameters={
                "limit": limit
            }))
            
            docs = [row for row in result]
            print(f"Found {len(docs)} documents in database:")
            for doc in docs:
                print(f"Document ID: {doc.get('doc_id', 'N/A')}")
                print(f"Session ID in doc: {doc.get('session_id', 'NOT_FOUND')} (type: {type(doc.get('session_id', 'NOT_FOUND'))})")
                print(f"Document content keys: {list(doc.keys())}")
                print(f"Full document: {doc}")
                print("---")
            
            return docs
            
        except Exception as e:
            print(f"Debug query error: {e}")
            import traceback
            traceback.print_exc()
            return []

    def clear_database(self) -> None:
        """
        Clear all data from the database.

        OBS IDK IF THIS WORKS, TEST IT FIRST
        """
        cluster = Cluster.connect(
            self.endpoint,
            ClusterOptions(PasswordAuthenticator(self.user, self.password)))
        
        bucket = cluster.bucket(self.bucket)
        collection = bucket.scope(self.scope).collection(self.collect) # type: ignore
        try:
            # Clear all documents in the collection
            query = f"DELETE FROM `{self.bucket}`.`{self.scope}`.`{self.collect}`"
            cluster.query(query)
            print("Database cleared successfully.")
        except CouchbaseException as e:
            print(f"Error clearing database: {e}")
            

if __name__ == "__main__":

    yabadabadu = QueryDB()
    yaba = yabadabadu.get_requests_by_ids(776176500, 5)
    for row in yaba:
        print(row)