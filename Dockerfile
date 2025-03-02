# Stage 1: Base image with Node.js and pnpm
FROM node:20.9.0-alpine AS base

# Install pnpm
RUN npm install -g pnpm@latest-10

# Set working directory
WORKDIR /app

# Copy package.json, pnpm-lock.yaml, and .nvmrc
COPY package.json pnpm-lock.yaml .nvmrc ./

# Copy patches directory if it exists
COPY patches ./patches

# Install dependencies, including applying patches
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Stage 2: Final stage
FROM base AS final

# Install zip utility and bash
RUN apk add --no-cache zip bash

# Set working directory
WORKDIR /extension

# Copy all files from base
COPY --from=base /app ./

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port for HMR
EXPOSE 5173

# Set the entrypoint to our new script
ENTRYPOINT ["docker-entrypoint.sh"]

# Set the default command (which can be overridden)
CMD ["build"]
