FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and install backend dependencies
COPY package*.json ./
RUN npm install

# Copy backend files
COPY backend ./backend

# Copy frontend source
COPY frontend-app ./frontend-app

# Build frontend
WORKDIR /app/frontend-app
RUN npm install
RUN npm run build

# Move back to root and set up production files
WORKDIR /app
COPY backend/server.js ./
COPY backend/routes ./routes
COPY backend/models ./models
COPY backend/middleware ./middleware

# Serve frontend build files from backend
RUN mkdir -p ./public
RUN cp -r ./frontend-app/build/* ./public/

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "backend/server.js"]