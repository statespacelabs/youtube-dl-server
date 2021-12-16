FROM node:14.17-buster

WORKDIR /home/anthic

COPY tsconfig.json ./
COPY package*.json ./
COPY node_modules node_modules
COPY tools tools

RUN npm i

COPY src src

RUN npm run build

CMD [ "node", "dist/app.js" ]
