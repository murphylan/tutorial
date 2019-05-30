#!/bin/bash

echo "Stop and clean all container ..."
docker container rm $(docker container ls -a -q)  -f
docker-compose rm -v

# echo "Clean all images with sba tag ..."
# docker rmi $(docker images | grep sba | tr -s ' ' | cut -d ' ' -f 3)

echo "docker-compose build and up ..."
docker-compose build
docker-compose up -d