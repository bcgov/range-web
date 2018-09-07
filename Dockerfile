# initializes a new image based on an existing image.
FROM node:9.6.1

# sets working directory.
WORKDIR /app

# separates the dependency installation from the edits to our actual source files.
COPY package.json /app
RUN npm install --no-optional

# copies files from the build context (which is usually the directory in which the Dockerfile resides) into the image.
COPY . .

# build the app and remove the packages specified in devDependencies.
RUN npm run build && \
    npm prune --production

# expose a port and run the server when a container start!
EXPOSE 3000
CMD [ "npm", "run", "serve" ]
