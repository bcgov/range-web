FROM node:10 as builder

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

WORKDIR /opt/app-root/src
COPY ./package*.json ./
COPY ./semantic.json ./
COPY semantic .
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2-alpine
EXPOSE 2015
COPY --from=builder /opt/app-root/src/build/ /srv/
COPY Caddyfile /etc/caddy
