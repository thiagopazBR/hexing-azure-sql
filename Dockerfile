##########################################################################
# First Stage buider                                                     #
# for dev, please run: docker build --target=builder -t backend-dev:v1 . # 
##########################################################################
FROM node:lts as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

ENV NODE_ENV=development
RUN npm i -g npm@latest \
  && npm config set unsafe-perm true \
  && npm install

COPY . .

RUN npm run build

#############################################################
# Second Stage buider                                       #
#############################################################
FROM node:lts-slim

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y \
  && apt-get install -y tzdata

ENV TZ=America/Sao_Paulo

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone \

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

ENV NODE_ENV=production
RUN npm i -g npm@latest \
  && npm install --production

COPY --from=builder /usr/src/app/build ./build

CMD [ "node", "build/index.js" ]