# Use node alpine image
FROM node:14.17.0

# Create app directory
WORKDIR /app
# Copy package-lock.json and package.json
COPY package*.json ./
# Install node modules
RUN npm install --quiet

# Copy all files from project excluding node_modules (via .dockerignore)
COPY . .

RUN npm run db:migrate --env production
RUN npm run db:seed

# Expose port 
EXPOSE 8500
# Exec form to avoid starting a shell session
CMD ["npm", "start"]