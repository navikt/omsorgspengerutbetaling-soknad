FROM node:alpine

WORKDIR /usr/src/app
COPY api-mock.js .
COPY package.json .
COPY package-lock.json .
RUN npm ci
#RUN apk update && apk add bash && apk add curl
ENV PUBLIC_PATH '/familie/sykdom-i-familien/soknad/omsorgspengerutbetaling'
EXPOSE 8083
CMD ["npm", "run", "start-api-mock"]
