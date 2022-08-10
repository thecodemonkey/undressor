FROM node:16 as build-stage
COPY ui /ui
WORKDIR /ui
EXPOSE 8080
RUN npm i
RUN npm run build:docker

FROM nginx:1.15
COPY --from=build-stage ./ui/dist/ui/ /usr/share/nginx/html
COPY ui/nginx.conf /etc/nginx/conf.d/default.conf
