# monorepo-microservice-app
Hands on microservice app development

make sure you have nestjs cli installed
# sudo npm install -g @nestjs/cli

create the nest app
# nest new ordering-app

cd into the ordering-app to generate your app/services which will make up the project

# nest generate orders  orders // for this project this will be the first and primary app
To start the application
# npm run start:dev [name of the app]

add a common library for the apps
# nest g app library common // you can imports them into your apps

 inside the common delete the files inside the src and create database folder and add the db configuration files

install the mongoose 
# npm i mongoose
# npm i @nestjs/mongoose 
# npm i @nestjs/config

install joi for validation schema
# npm i joi

We used mongodb from bitnami repo, copied the docker-compose-repica
paste in my docker-compose.yml
under the primary serive  volume add
# ports:
#  - '27017:27017'

run docker-compose up to set up the mongodb
# docker-compose up

create Dockerfile under each of our app and configure

create your service on the docker-compose.yml file

# npm i class-transformer 
  -- this help the validator to work properly

whenever you add new library, run 'docker-compose up --build -V'

Connecting our microservice in this application:
- we initialize our billng app as a rabimq service
# npm i @nestjs/microservices
# npm i amqplib amqp-connection-manager

in lib/src
 create a folder `rmq`
 the create file rmq/rmq.module.ts
 create a new rmq.service.ts
