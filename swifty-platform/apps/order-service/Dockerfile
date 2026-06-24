FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependency graphs
COPY package*.json ./
RUN npm ci

# Copy source maps
COPY . .
# Generate Prisma Client (if schema exists)
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; fi

# Production Stage
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Highly optimized for AWS ECS instances
ENV NODE_ENV=production
EXPOSE 3001

CMD ["npm", "start"]
