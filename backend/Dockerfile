FROM node:20-bookworm-slim

WORKDIR /app

# Required by the MongoDB binary used by mongodb-memory-server.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libcurl4 \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies first to make Docker build caching effective.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the application after installing dependencies.
COPY . ./

ENV NODE_ENV=production
ENV PORT=5000
# mongodb-memory-server defaults to MongoDB 6.0.14, which has no Debian 12 build.
ENV MONGOMS_VERSION=7.0.3

EXPOSE 5000

CMD ["npm", "start"]
