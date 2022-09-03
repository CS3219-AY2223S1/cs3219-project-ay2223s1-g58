# Use node alpine image
FROM node:14.17.0

# Set working directory
WORKDIR /app
# Copy package-lock.json and package.json
COPY package*.json ./
# Install node modules
RUN npm install --quiet
# Copy all files from project excluding node_modules (via .dockerignore)
COPY . .
# Create sqlite3 database tables
RUN npm run db:migrate
# Expose port 
EXPOSE 8001
# Exec form to avoid starting a shell session
CMD ["npm", "start"]