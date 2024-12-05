# Dockerfile for react app
# Build the react app
FROM node:20.0-slim as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Serve the react app

FROM nginx:1.19.0-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
