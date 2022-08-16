FROM node:16.14-alpine

WORKDIR /opt/app-root/src
COPY ./package*.json ./
COPY ./semantic.json ./
COPY semantic .
RUN npm ci
COPY . .
RUN npm run build

