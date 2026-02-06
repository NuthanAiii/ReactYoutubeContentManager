# Docker Notes for FastAPI Project

## What is Docker?
Docker is a platform that allows you to package applications and their dependencies into containers. Containers are lightweight, portable, and ensure consistency across different environments (development, testing, production).

## What We Did
1. **Dockerized the FastAPI Application**: We created a Dockerfile to build an image for our FastAPI backend.
2. **Used SQLite Database**: The app uses SQLite, storing the database file at `./data/content.db`.
3. **Mapped a Volume for Persistence**: We mapped the `data` folder from the host to the container to ensure the database persists even if the container is removed or recreated.
4. **Set Environment Variables**: We passed the `DATABASE_URL` as an environment variable to configure the app inside the container.

## Why We Did It
- **Consistency**: Docker ensures the app runs the same way everywhere.
- **Isolation**: Dependencies and environment are isolated from the host system.
- **Persistence**: Mapping the `data` folder keeps the database data safe between container runs.
- **Configurability**: Using environment variables makes it easy to change settings without modifying code.

## Docker Commands Used

### Build the Docker Image
```
docker build -t media-backend .
```
- Builds a Docker image named `media-backend` from the current directory.

### Run the Docker Container
```
docker run -p 8000:8000 \
  -e DATABASE_URL=sqlite:///./data/content.db \
  -v $(pwd)/data:/app/data \
  media-backend
```
- `-p 8000:8000`: Maps port 8000 on your host to port 8000 in the container.
- `-e DATABASE_URL=...`: Sets the environment variable for the database URL.
- `-v $(pwd)/data:/app/data`: Maps the `data` directory from your host to `/app/data` in the container for persistent storage.
- `media-backend`: The name of the image to run.

### Stop a Running Container
```
docker stop <container_id>
```
- Stops a running container by its ID.

### Open a Shell Inside a Running Container
```
docker exec -it <container_id> /bin/sh
```
- Opens an interactive shell session inside the container.

### Check the SQLite Database Inside the Container
```
sqlite3 /app/data/content.db
```
- Opens the SQLite database for direct inspection.

---

These steps ensure your FastAPI app runs reliably in Docker, with persistent data and easy configuration.