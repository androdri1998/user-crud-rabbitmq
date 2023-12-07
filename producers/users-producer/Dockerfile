FROM node:20

WORKDIR /users-producer
COPY package.json .
RUN npm install
COPY . .
CMD npm start