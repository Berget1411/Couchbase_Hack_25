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
        response = ""

        return response