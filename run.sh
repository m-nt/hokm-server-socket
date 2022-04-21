#!/bin/sh
git pull
docker rm -f socket
docker images
read IMAGE
docker image rm $IMAGE
docker build . -t server-socket
docker run -d -p 127.0.0.1:3000:3000 --link mongodb:mongodb --name socket server-socket
docker run -d -p 127.0.0.1:3001:3000 --link mongodb:mongodb --name socket1 server-socket
docker run -d -p 127.0.0.1:3002:3000 --link mongodb:mongodb --name socket2 server-socket
docker logs -f socket