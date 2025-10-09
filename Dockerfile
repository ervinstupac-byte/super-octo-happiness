# Stage 1: Build the React application
FROM node:20-slim as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built application with nginx
FROM nginx:stable-alpine
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY start-nginx.sh /start-nginx.sh
RUN chmod +x /start-nginx.sh
CMD ["/start-nginx.sh"]
