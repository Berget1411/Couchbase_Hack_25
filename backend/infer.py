"""
LLM file
"""

class LLM():
    def __init__(self):
        self.model=""
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