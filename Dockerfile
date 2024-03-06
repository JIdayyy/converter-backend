# pull the Node.js Docker image
FROM node:18-alpine

# create the directory inside the container

WORKDIR /usr/src/

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/app/
RUN npm install
RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . /usr/src/app


# our app is running on port 5000 within the container, so need to expose it
EXPOSE 4000

# the command that starts our app
CMD ["npm", "start"]