# Dockerfile for react app
# Build the react app
FROM node:20.0-slim as build

WORKDIR /app

COPY . ./

RUN npm install

# Rename .env.docker tp .env
RUN mv .env.docker .env

RUN npm run build

# Serve the react app
FROM nginx:1.19.0-alpine

COPY --from=build /app/build /usr/share/nginx/html
# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
