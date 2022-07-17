FROM node:16-alpine as base

RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
COPY . /usr/src/app

FROM base as production
# docker build . -t backend-prod:v1 --target=production
# docker run --name backend-prod -d -t backend-prod:v1

ENV NODE_ENV=production
RUN npm install --production

CMD ["npm", "start"]


FROM base as dev
# docker build . -t backend-dev:v1 --target=dev
# docker run --name backend-dev -d -t backend-dev:v1

ENV NODE_ENV=development
RUN npm config set unsafe-perm true
RUN npm install
CMD ["npm", "run", "dev"]
