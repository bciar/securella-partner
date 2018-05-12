FROM node:latest

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs npm
RUN mkdir /app
WORKDIR /app

COPY package.json /app

ADD . /app

RUN npm install
