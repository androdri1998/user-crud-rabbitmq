# RabbitMQ Project

## Main libs

- fastify
- amqplib
- typeorm
- date-fns
- dotenv
- jest
- mysql
- typescript

## requirements

- Need to have [docker](https://www.docker.com/get-started/) installed.
- Need to have [docker-compose](https://docs.docker.com/compose/install/) installed.

## Setup Project

To setup project follow these steps ahead.

### 1. Create a `.env` file

Create a `.env` file at root directory, there's a `.env.example` to be used as a draft and model.

### 2. Fill environment Variables

```
MYSQL_DATABASE=[MYSQL_DATABASE]
MYSQL_USER=[MYSQL_USER]
MYSQL_PASSWORD=[MYSQL_PASSWORD]
MYSQL_ROOT_PASSWORD=[MYSQL_ROOT_PASSWORD]
MYSQL_PORT=[MYSQL_PORT]

RABBITMQ_USER=[RABBITMQ_USER]
RABBITMQ_PASSWORD=[RABBITMQ_PASSWORD]
AMQP_RABBITMQ_PORT=[AMQP_RABBITMQ_PORT]
HTTP_RABBITMQ_PORT=[HTTP_RABBITMQ_PORT]

# MYSQL_HOST there's no need to fill, this variable is provided by docker compose setup
MYSQL_HOST=[MYSQL_HOST]

# RABBIMQ_HOST there's no need to fill, this variable is provided by docker compose setup
RABBIMQ_HOST=[RABBIMQ_HOST]

NODE_USERS_PRODUCER_PORT=[NODE_USERS_PRODUCER_PORT]
NODE_USERS_CONSUMER_PORT=[NODE_USERS_CONSUMER_PORT]

NODE_APP_HOST=[NODE_APP_HOST]
```

### 3. Start container with docker compose

`$ docker-compose up -d`

### Observation

Due RabbitMQ require a while to setup service, consumer and producer can became unavailable right after setup, because it's not possible connect with RabbitMQ while RabbitMQ it's setting up service, but after some minutes(2 or 3 minutes) docker will automatically recreate new containers that will connect correctly to RabbitMQ.

## Application

### Access producer API

- API will be available at host `localhost` and port `[NODE_USERS_PRODUCER_PORT]`.
- credentials:

```
MYSQL_USER=[MYSQL_USER]
MYSQL_PASSWORD=[MYSQL_PASSWORD]
MYSQL_ROOT_PASSWORD=[MYSQL_ROOT_PASSWORD]
```

`to access as a root user use root user and [MYSQL_ROOT_PASSWORD]`

### Routes

- Create a new user

```
POST http://localhost:[NODE_USERS_PRODUCER_PORT]/users
BODY {
  name: string,
  description: string
}
```

- Create a new user

```
DELETE http://localhost:[NODE_USERS_PRODUCER_PORT]/users/:id
BODY {}
```

### Access RabbitMQ

- It's possible to see RabbitMQ UI using `RABBITMQ_USER` and `RABBITMQ_PASSWORD` at url `http://localhost:[HTTP_RABBITMQ_PORT]`.

### Access MySQL

- An application to see database it's needed, url to connect it's `http://localhost:[MYSQL_PORT]`.

## Stop project

### Stop and remove containers created by docker compose

`$ docker-compose down`

### Stop and remove containers and remove images created by docker compose

`$ docker-compose down --rmi all`

## Development

### To update docker images with services changes

Run this commands

- 1. `$ docker-compose down`
- 2. `$ docker-compose build`
- 3. `$ docker-compose up -d`
