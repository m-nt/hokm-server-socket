FROM node:12.18.4
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000:3000
CMD ["node","server.js"]