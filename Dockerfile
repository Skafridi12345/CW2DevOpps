# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose the correct port (matches server.js)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
