# Dockerfile for a Nuxt 4 Application
# 1. Base Stage: Use a lightweight Node.js image
FROM node:20-alpine AS base
WORKDIR /app

# 2. Dependencies Stage: Install dependencies in a separate layer to cache them
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* pnpm-lock.yaml* package-lock.json* ./
# Install dependencies using the appropriate package manager
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 3. Build Stage: Build the Nuxt application
FROM base AS builder
WORKDIR /app
# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .

# Accept the POSTCODE_API_TOKEN as a build-time argument
ARG POSTCODE_API_TOKEN
# Make it available as an environment variable during the build process
ENV POSTCODE_API_TOKEN=${POSTCODE_API_TOKEN}

# Run the Nuxt build command
RUN npm run build

# 4. Production/Runner Stage: Create the final, lightweight image
FROM base AS runner
WORKDIR /app

# Set the node environment to production
ENV NODE_ENV=production

# Copy the built output from the builder stage
COPY --from=builder /app/.output ./.output
# Copy production node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# The command to start the production server
CMD [ "node", ".output/server/index.mjs" ]