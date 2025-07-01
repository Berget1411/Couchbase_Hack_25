import streamlit as st
import requests

# Page config
st.set_page_config(page_title="Simple Chatbot", page_icon="🤖")

# Simple styling
st.markdown("""
<style>
    .chat-box {
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
    }
    .user { background-color: #e3f2fd; }
    .assistant { background-color: #f3e5f5; }
</style>
""", unsafe_allow_html=True)

# Initialize chat
if "messages" not in st.session_state:
    st.session_state.messages = []

# Title
st.title("🤖 Simple OpenAI Chatbot")

# Chat display
for message in st.session_state.messages:
    role = "user" if message["role"] == "user" else "assistant"
    st.markdown(f"""
    <div class="chat-box {role}">
        <strong>{'👤 You' if role == 'user' else '🤖 Assistant'}:</strong><br>
        {message["content"]}
    </div>
    """, unsafe_allow_html=True)

# Chat input
user_input = st.text_area("Type your message:")

col1, col2 = st.columns([1, 4])
with col1:
    send = st.button("Send")
with col2:
    if st.button("Clear"):
        st.session_state.messages = []
        st.rerun()

# Process message
if send and user_input.strip():
    # Add user message
    st.session_state.messages.append({"role": "user", "content": user_input.strip()})
    
    # Show loading
    with st.spinner("Waiting for response..."):
        try:
            # Send to backend
            response = requests.post(
                "http://localhost:8000/chat",
                json={"input": user_input.strip()},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if "response" in data:
                    st.success(data["response"])
                else:
                    st.error(data.get("error", "Unknown error"))
            else:
                st.error(f"Server error: {response.status_code}")
                
        except Exception as e:
            st.error(f"Connection error: {e}")
else:
    st.warning("Please enter a message.")

# Instructions
st.markdown("---")
st.markdown("""
**Instructions:**
1. Enter your OpenAI API key in the sidebar
2. Make sure the backend is running: `python backend.py`
3. Type your message and click Send
""") 