FROM node:boron

RUN apt-get update
RUN apt-get -y install timidity

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

CMD ["node", "index.js"]