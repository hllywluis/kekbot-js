# Docker Setup Guide

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Configuration

1. Create a `.env` file in the project root with your Discord bot credentials:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Discord bot token and other credentials:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_client_id_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

## Running with Docker Compose (Recommended)

### Start the bot:

```bash
docker-compose up -d
```

### View logs:

```bash
docker-compose logs -f
```

### Stop the bot:

```bash
docker-compose down
```

### Restart the bot:

```bash
docker-compose restart
```

### Rebuild and start (after code changes):

```bash
docker-compose up -d --build
```

## Running with Docker directly

### Build the image:

```bash
docker build -t kekbot:latest .
```

### Run the container:

```bash
docker run -d \
  --name kekbot \
  --env-file .env \
  --restart unless-stopped \
  kekbot:latest
```

### View logs:

```bash
docker logs -f kekbot
```

### Stop the container:

```bash
docker stop kekbot
docker rm kekbot
```

## Deploy Commands

Before running the bot for the first time, you may need to deploy slash commands:

```bash
# Using Docker Compose
docker-compose run --rm kekbot npm run deploy

# Using Docker directly
docker run --rm --env-file .env kekbot:latest npm run deploy
```

## Troubleshooting

### Check if container is running:

```bash
docker ps
```

### View all containers (including stopped):

```bash
docker ps -a
```

### Access container shell:

```bash
docker exec -it kekbot sh
```

### View container resource usage:

```bash
docker stats kekbot
```

## Production Considerations

1. **Security**: Ensure your `.env` file is never committed to version control
2. **Logging**: Configure log rotation if using volume mounts for logs
3. **Updates**: Regularly update the base image and dependencies
4. **Monitoring**: Consider adding monitoring tools like Prometheus or Grafana
5. **Backups**: If you add persistent data, implement backup strategies

## Multi-stage Build (Alternative)

For a smaller production image, you can use the multi-stage Dockerfile variant:

```dockerfile
# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs
CMD ["npm", "start"]
```
