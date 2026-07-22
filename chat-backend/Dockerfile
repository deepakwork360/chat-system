FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start the server directly with node so SIGTERM/SIGINT signals are handled cleanly
CMD ["node", "dist/server.js"]
