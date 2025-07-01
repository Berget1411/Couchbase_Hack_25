import streamlit as st
import requests
import json

API_URL = "http://localhost:8500/mock"

st.title("Test Send Interface")

# Text area for JSON payload input
payload_text = st.text_area("Enter JSON payload:", value='{"foo": "JS", "number": 123}', height=100)

# Send button
if st.button("Send POST Request"):
    try:
        # Parse the JSON input
        payload = json.loads(payload_text)
        
        # Send the request (same as original test_send.py)
        response = requests.post(API_URL, json=payload)
        
        # Display results (same output format as original)
        st.write("Status code:", response.status_code)
        st.write("Response:", response.text)
        
    except json.JSONDecodeError:
        st.error("Invalid JSON format")
    except Exception as e:
        st.error(f"Error: {e}")