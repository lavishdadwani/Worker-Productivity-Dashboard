# Use Node
FROM node:20

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all code
COPY . .

# Expose port
EXPOSE 8000

# Start server
CMD ["node", "server.js"]