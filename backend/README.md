## Set up backend environment:

pip install uv
uv venv
source .venv/bin/activate

uv pip install -r requirements.txt


## Run:
docker-compose up -d  # With Docker
### Or:
python api_server.py  # Local