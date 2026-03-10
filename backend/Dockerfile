# Use slim base image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Install dependencies (only production for final image)
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Run the app
CMD ["node", "index.js"]
