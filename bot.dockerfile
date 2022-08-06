FROM node:16

COPY api /bot
WORKDIR /bot

RUN npm i
RUN npm run build

CMD ["npm", "run", "start:bot"]
