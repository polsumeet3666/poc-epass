#!/bin/bash
set -e


cd ../first-network
echo y | ./byfn.sh down

echo y |docker rm -f $(docker ps -aq) 
 
echo y |docker rmi -f $(docker images | grep epass | awk '{print$3}') 

echo y |docker ps -a

