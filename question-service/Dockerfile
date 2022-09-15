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

# Expose port 
EXPOSE 8500
ENTRYPOINT ["./entrypoint.sh"]
# Exec form to avoid starting a shell session
CMD ["npm", "start"]