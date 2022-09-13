# CS3219-AY22-23-Project-PeerPrep

PeerPrep

## Development

Spin up all the services for local manual testing

```bash
docker-compose -f docker-compose.local.yml up --build -d
```

Visit the frontend at http://localhost:3000

To stop the services

```bash
docker-compose -f docker-compose.local.yml stop
```

Available seeded users for testing:

| Username | Password |
|----------|----------|
| qwe      | qwe      |
| asd      | asd      |
| zxc      | zxc      |

## User Service
1. Rename `.env.sample` file to `.env`.
1. Create a Cloud DB URL using Mongo Atlas.
1. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
1. Setup dependencies via `npm ci`
1. Install npm packages using `npm i`.
1. Run User Service using `npm run dev`.

## Frontend
1. Setup dependencies via `npm ci`
1. Install new npm packages using `npm i`.
1. Run Frontend using `npm start`.
