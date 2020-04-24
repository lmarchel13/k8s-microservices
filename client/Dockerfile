FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY ./ ./
ENV CI=true
CMD ["yarn", "start"]