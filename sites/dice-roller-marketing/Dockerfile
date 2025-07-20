# Multi-stage build for production SaaS deployment
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY client/package.json ./client/
RUN npm ci --only=production

# Build frontend
FROM base AS frontend-builder
WORKDIR /app
COPY client/ ./client/
COPY client/package.json ./client/
WORKDIR /app/client
RUN npm ci
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy backend source code
COPY server/ ./server/
COPY knexfile.js ./
COPY .env.example ./.env.example

# Copy built frontend
COPY --from=frontend-builder /app/client/dist ./public

# Create logs directory
RUN mkdir logs && chown nextjs:nodejs logs

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]