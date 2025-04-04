# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json if you have one (skip if not using)
# COPY package*.json ./
# RUN npm install

# Copy app files
COPY . .

# Expose port (match what your app listens on)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
