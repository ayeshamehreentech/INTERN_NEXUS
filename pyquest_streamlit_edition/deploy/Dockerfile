FROM python:3.12-slim
RUN apt-get update && apt-get install -y --no-install-recommends nginx && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY pyquest_streamlit_edition/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY pyquest_streamlit_edition/ ./
COPY pyquest_streamlit_edition/deploy/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["sh", "deploy/start.sh"]
