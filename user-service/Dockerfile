FROM node:14.17.0

# Create /usr/app directory
WORKDIR /usr/app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm ci --quiet

# Copy source files
COPY . .

EXPOSE 8000

# Run the app
CMD ["npm", "start"]