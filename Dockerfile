FROM node:16

WORKDIR /opt/app-root/src
COPY ./package*.json ./
COPY ./semantic.json ./
COPY semantic .
RUN npm ci
COPY . .
RUN npm run build

