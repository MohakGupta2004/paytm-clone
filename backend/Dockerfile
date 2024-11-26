FROM node:18-alpine3.19

WORKDIR /paytm-app

COPY package*.json .
RUN npm ci
RUN npm install
COPY . . 
RUN apk add --no-cache make gcc g++ python3
EXPOSE 5000
CMD ["npm", "start"]
