FROM node:20-alpine

# Enable pnpm
RUN corepack enable

WORKDIR /app

# Configure Network (Timeout settings to prevent installation failures)
RUN pnpm config set fetch-retries 10 \
    && pnpm config set fetch-retry-mintimeout 60000 \
    && pnpm config set fetch-retry-maxtimeout 1200000 \
    && pnpm config set registry "https://registry.npmjs.org/"

# Copy config files
COPY package.json pnpm-lock.yaml ./

# Install Dependencies (Standard, no frozen lockfile for better compatibility)
RUN pnpm install

# Copy Source Code
COPY . .

# Expose Port
EXPOSE 5000

# Start Production Server
CMD ["node", "server.js"]