FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

FROM nginx

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

# Remove default nginx configs to avoid conflict
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

