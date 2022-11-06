# History service
For recording a user's matching history and the questions completed in each match.

## Usage and Local development
1. Install Node 14 and above
2. Rename file `.env.example` to `.env`. The default environment is `DEV`, but you can also change to `PROD`. Provide the mongoDB URI for the variable `DB_LOCAL_URI` or `DB_URI_PROD` accordingly.
    * For example, `DB_LOCAL_URI=mongodb://localhost:27017/leetwithfriend` and make sure mongoDB is running on localhost port 27017
    * Or, `DB_URI_PROD=<mongoDB Atlas cluster URI>`
3. Install dependencies with `npm install`.
4. Run with `npm run dev`.

## Run with Docker
- Via docker-compose: `docker-compose up --build`
- Via docker

Provide your mongoDB URI in the docker run command. This **must** be a cloud URI (e.g. Atlas cluster). Recommended to encase the URL within quotes like `'your_URI'` to avoid any parsing error in the shell.
```bash
docker build -t history-service .
docker run -d -p 8080:8080 -e DB_LOCAL_URI={your_URI} history-service
```
