import tempfile
import subprocess
import os
import sys
import json
from developer.smol_dev.prompts import analyze_codebase

def clone_repo(repo_url):
    temp_dir = tempfile.mkdtemp()
    subprocess.run(["git", "clone", repo_url, temp_dir], check=True)
    return temp_dir

def summarize_codebase(repo_path, max_files=10):
    summary = []
    for root, dirs, files in os.walk(repo_path):
        for file in files:
            if file.endswith(('.py')):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    code = f.read(1000)  # Read first 1000 chars
                summary.append(f"File: {file_path}\n{code}\n---\n")
                if len(summary) >= max_files:
                    break
        if len(summary) >= max_files:
            break
    return "\n".join(summary)

if __name__ == "__main__":
    repo_url = sys.argv[1]
    user_query = sys.argv[2]
    input_requests = sys.argv[3:]  # Or load from a file

    repo_path = clone_repo(repo_url)
    codebase_summary = summarize_codebase(repo_path)
    result = analyze_codebase(codebase_summary, user_query, input_requests)
    
    # Ensure the result is valid JSON
    try:
        # Try to parse as JSON to validate
        json.loads(result)
        #print("Valid JSON response:")
        print(result)

    except json.JSONDecodeError:
        print("Invalid JSON response, wrapping in structured format.")
        # If not valid JSON, wrap it in a structured format
        fallback_response = {
            "question_rephrase": f"Analysis of: {user_query} with requests: {input_requests}",
            "Code snippet": "Unable to extract specific code snippet from the response",
            "proposed_fix": result
        }
        print(json.dumps(fallback_response, indent=2))
