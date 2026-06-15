FROM node:24-alpine

WORKDIR /opt/app-root/src
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build

