FROM node:12

ENV MYSQL_ROOT_PASSWORD=shule34HEdfer
ENV MYSQL_DATABASE=shule_db
ENV MYSQL_USER=developer
ENV MYSQL_PASSWORD=shule34HEdfer
ENV MYSQL_PORT=15000
ENV MYSQL_HOST="127.0.0.1"
ENV GOOGLE_APPLICATION_CREDENTIALS=/home/george/Downloads/gads-app-demo-ae251b89a45c.json

WORKDIR /app

COPY ./server/package*.json ./
COPY ./server/package-lock.json ./package-lock.json

RUN npm install

COPY ./server .


EXPOSE 3000

CMD ["node", "index.js"]