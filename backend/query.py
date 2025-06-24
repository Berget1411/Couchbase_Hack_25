"""
Database query functions for SmartPyLogger backend
"""

import psycopg2
import json
import os
from string import Template
from typing import List, Dict, Any, Optional


def get_db_connection():
    """Get PostgreSQL database connection"""
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        database=os.getenv("DB_NAME", "smartpylogger_db"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "admin"),
        port=os.getenv("DB_PORT", "5432")
    )


def get_requests_by_ids(request_ids: List[int], user_id: str) -> List[Dict[str, Any]]:
    """
    Query PostgreSQL for specific request rows by their IDs.
    
    Args:
        request_ids: List of request IDs to fetch (rows)
        user_id: User ID for security (only fetch user's own requests)
    
    Returns:
        List of request dictionaries with full data
    """
    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        # SQL query template with safe substitution by user_id
        query_template = Template("""
            SELECT id, request_data, created_at 
            FROM requests 
            WHERE id = ANY(${request_ids}) AND user_id = ${user_id}
            ORDER BY created_at DESC
        """)
        
        query = query_template.safe_substitute(
            request_ids=request_ids,
            user_id=user_id
        )
        
        cursor.execute(query)
        
        requests = []
        for row in cursor.fetchall():
            requests.append({
                "id": row[0],
                "request_data": json.loads(row[1]) if isinstance(row[1], str) else row[1],
                "created_at": row[2].isoformat() if row[2] else None
            })
        
        cursor.close()
        db.close()
        
        return requests
        
    except Exception as e:
        print(f"Database query error: {e}")
        return []


def get_all_user_requests(user_id: str, limit: int = 100) -> list[dict[str, Any]]: # type: ignore
    pass
        