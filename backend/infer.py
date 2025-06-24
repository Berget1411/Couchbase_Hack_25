"""
LLM file
"""

import openai
from openai import OpenAI
import os

class LLM():
    def __init__(self):
        self.model="o3-mini"
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.query=""

    def get_response(self, query: str, context: str) -> str: # type: ignore
        """
        Query obvious,
        Context is the requests the user has chosen to analyse.
        """
        sys_query = """
        You are a HTTP/HTTPS request analysis assistant. The user may send you a list of requests to analyse as well a query.
        You will do your best to return a response considering data safety, 
        """
        final_query = "USER QUERY: " + query + "\n" + "REQUESTS CHOSEN:"

        response = final_query

        return response