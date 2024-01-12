FROM node:latest

WORKDIR /server

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3030

CMD ["yarn", "start:dev"]
