FROM node:14.17.0

# Create the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --quiet

# Copy source files
COPY . .

EXPOSE 8080

# Run the app
CMD ["npm", "start"]