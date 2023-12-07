FROM node:20

WORKDIR /users-consumer
COPY package.json .
RUN npm install
COPY . .
CMD npm start