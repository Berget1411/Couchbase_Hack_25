## Set up backend API:
in api/:

pip install uv
uv venv
source .venv/bin/activate

uv pip install -r requirements.txt

in api/developer/:

poetry lock

poetry install

(NOW U CAN RUN main.py in developer/ to input command-line prompts)

## Run:
docker-compose up -d  # With Docker
### Or:
python api_server.py  # Local

