FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm config set proxy http://proxy.jp.sbibits.com:8080
RUN npm config set https-proxy http://proxy.jp.sbibits.com:8080
RUN npm install
COPY . /app
CMD yarn run start_local
EXPOSE 3000