# Deployment Guide

## Docker

Container images are deployed under the b9jmthkk account on Docker Hub. E.g https://hub.docker.com/repository/docker/b9jmthkk/question

## Production

- Go to Google Cloud console and create a new project
- Enable billing
- Create new cluster
  - choose zone near the region
- Run the required commands in `init.sh` from the Google Cloud Shell
- Push to branch `production`

## Local Deployment in KIND

- Ensure KIND is installed
- Run the required commands in `init.sh` from the root of the repository
