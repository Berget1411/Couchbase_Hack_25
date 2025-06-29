import asyncio
from api_server import push_selected_requests_response

# Use the mock query_dict above
query_dict = {
    "repo_url": "https://github.com/pallets/flask",
    "user_query": "Where does flask handle HTTP requests?",
    "input_requests": [
        "GET /",
        "POST /login"
    ]
}

# Run the async function
result = asyncio.run(push_selected_requests_response(query_dict))
#print(result)