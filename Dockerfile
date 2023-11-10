# #stage 1

# FROM node:14.20.1 as node

# WORKDIR /app

# COPY . .

# RUN npm install

# RUN npm run build --prod

#stage 2

FROM nginx:alpine

COPY /dist/vuexy /usr/share/nginx/html