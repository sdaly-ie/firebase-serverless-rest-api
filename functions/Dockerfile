# Functions Docker image for local lint/test workflow (does not replace Firebase deployment)
FROM node:22-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Default command (can be overridden at runtime)
CMD ["npm", "test"]