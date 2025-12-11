# Dockerfile for Next.js application
CMD ["node", "server.js"]

EXPOSE 3000

USER nextjs

RUN chown -R nextjs:nodejs /app
# Set proper permissions

COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
# Copy necessary files

RUN adduser --system --uid 1001 nextjs
RUN addgroup --system --gid 1001 nodejs
# Create a non-root user

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV NODE_ENV=production

WORKDIR /app
FROM base AS runner
# Production stage

RUN pnpm run build
# Build the Next.js application

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

WORKDIR /app
FROM base AS builder
# Build stage

RUN pnpm install --frozen-lockfile
COPY package.json pnpm-lock.yaml ./

WORKDIR /app
FROM base AS dependencies
# Dependencies stage

RUN npm install -g pnpm
# Install pnpm

FROM node:20-alpine AS base

