# --- Stage 1: Build ---
FROM node:20-alpine as builder
RUN corepack enable
WORKDIR /app

# Network Config
RUN pnpm config set fetch-retries 10 \
    && pnpm config set fetch-retry-mintimeout 60000 \
    && pnpm config set fetch-retry-maxtimeout 1200000 \
    && pnpm config set registry "https://registry.npmjs.org/"

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Build Arguments
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN pnpm build

# --- Stage 2: Serve ---
FROM nginx:alpine

# Swap config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy Build Artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]