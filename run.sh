#!/bin/sh
git pull
docker rm -f socket
docker images
read IMAGE
docker image rm $IMAGE
docker build . -t server-socket
docker run -d -p 127.0.0.1:3000:3000 --restart always --link mongodb:mongodb --name socket server-socket
docker logs -f socket