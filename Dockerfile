FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create temp directory for favicons
RUN mkdir -p /tmp/favicons

# Expose port
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ] 