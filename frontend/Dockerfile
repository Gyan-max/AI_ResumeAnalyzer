# Build stage
FROM node:16-alpine as build

WORKDIR /app

COPY frontend/package.json .
COPY frontend/package-lock.json* .

RUN npm install

COPY frontend/ .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built app to NGINX html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom NGINX config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
