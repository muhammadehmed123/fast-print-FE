# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .



# Build the app
RUN npm run build

# Install lightweight web server
RUN npm install -g serve

# Expose port (Vite preview default)
EXPOSE 4173

# Start app using serve
CMD ["serve", "-s", "dist", "-l", "4173"]
