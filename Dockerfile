# BK-IC Digital Hub - Production Dockerfile
FROM node:22-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build frontend production assets into /dist
RUN npm run build

# Volume for persistent database
VOLUME ["/app/data"]

EXPOSE 3000

CMD ["npm", "start"]
