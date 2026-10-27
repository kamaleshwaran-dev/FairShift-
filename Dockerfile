# Multi-stage Dockerfile for FairShift deployment to Google Cloud Run
# Stage 1: Build frontend assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Google Cloud Run injects $PORT at container startup (defaults to 8080)
ENV PORT=8080

COPY package*.json ./
RUN npm ci --omit=dev && npm install tsx typescript

# Copy server and built client bundle from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
