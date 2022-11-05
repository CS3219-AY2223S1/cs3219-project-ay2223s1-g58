# Matching Service

# Setup environment variables

1. Rename `.env.example` to `.env`

## Usage

1. Install npm packages using `npm install`.
2. Set up SQLite database using `npm run db:migrate`.
3. Run Matching Service using `npm run dev`.

## Docker

- Via docker-compose: `docker-compose up --build`
- Via docker

```bash
docker build . -t room-service
docker run -p 8022:8022 -d room-service
```

## Continuous integration (CI)

- Running automated tests in docker

```bash
docker-compose -f docker-compose.test.yml up --exit-code-from nodeserver --build
```
