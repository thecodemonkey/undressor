FROM node:16

COPY ../api /api
WORKDIR /api

RUN npm i
RUN npm run build

EXPOSE $PORT

CMD ["npm", "run", "start"]
