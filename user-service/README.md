# User service

## Usage

1. Rename `.env.sample` file to `.env`.
2. Install npm packages using `npm ci`.
3. Run User Service using `npm run dev`.

## Docker

- Via docker-compose: `docker-compose up -d --build`
- Via docker

```bash
docker build . -t user-service
docker run -p 8000:8000 -d user-service
```

Then visit `http://localhost:8000/api/user` to see that hello world!

## JWT

JWT is a JSON Web Token (JWT) is a compact token format used to represent claims to be transferred between two parties.

## Reference

https://www.youtube.com/watch?v=T0k-3Ze4NLo
https://softwareengineering.stackexchange.com/questions/387243/best-practice-to-confirm-unique-username-for-user-creation-in-jsp-and-jdbc
