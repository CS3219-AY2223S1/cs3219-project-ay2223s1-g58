# History service
For recording a user's matching history and the questions completed in each match.
## Setting up

1. Install Node 14 and above
2. Install dependencies with `npm install`.
3. Rename file `.env.example` to `.env`.
4. **Important**: This guide only starts the History service. The endpoint to get user's history depends on the Question service as well, so you must make sure Question service is up and running (see Question service's [README](../question-service/README.md))
5. Run `docker-compose up --build`
6. The service is available on http://localhost:8080. API endpoints are documented at [requests.rest](./requests.rest).

## Local development
For daily development on the local environment, 
1. Follow steps 1 to 4 of [Setting up](#setting-up)
2. In the `.env` file, change the environment to `production` and `DB_MONGO_URI` to `mongodb://localhost:27017/peerprep`
    - If you want to provide a custom URI such as a mongoDB Atlas cluster, fill in `DB_MONGO_URI` accordingly.
3. Start the database service with `docker-compose -f docker-compose.dev.yml up --build -d`
4. Start the Express server with `npm run dev`
5. To shut down the database, run `docker-compose -f docker-compose.dev.yml stop`

## Run automated tests with Docker
Run Mocha tests for the Express server with `docker-compose -f docker-compose.test.yml up --exit-code-from web --build`
