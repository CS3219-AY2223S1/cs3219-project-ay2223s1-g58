# User service

## Prerequisites

It is recommended to have redis and mongodb installed locally. If you don't have them installed, you can use docker-compose to start them.

## Development Guide

(initial setup)

1. Install Node.js 14 and above
1. Install dependencies via `npm ci`
1. Rename `.env.dev` file to `.env`

(for local setup and manual testing)

`docker-compose -f docker-compose.yml up --build`

OR

(daily development)

1. Start the required database services:
   1. `docker-compose -f docker-compose.dev.yml up --build`
1. Start the express server:
   1. `npm run dev`

OR

(running automated tests in docker)
`docker-compose -f docker-compose.test.yml up --exit-code-from web --build`

## Docker Guide

(Work in progress, development wise please follow the development guide)

Run everything in docker, for production/preview environment:

- Either via docker-compose: `docker-compose up --build`,
- Or via docker (assuming mongoDB and redis is up and running in the cloud instead):
  - `docker build -t user-service .`
  - `docker run -p 8000:8000 user-service`

Then visit `http://localhost:8000/api/v1/user/status` to see that hello world!

## JWT

JWT is a JSON Web Token (JWT) is a compact token format used to represent claims to be transferred between two parties.

To generate the secret tokens, use the following command:

```bash
node
require('crypto').randomBytes(64).toString('hex')
```

## Reference

- https://www.youtube.com/watch?v=T0k-3Ze4NLo
- https://softwareengineering.stackexchange.com/questions/387243/best-practice-to-confirm-unique-username-for-user-creation-in-jsp-and-jdbc
