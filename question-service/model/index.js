import pgPromise from 'pg-promise'
import promise from 'bluebird'

// pg-promise initialization options:
const initOptions = {
    promiseLib: promise
};


const pgp = pgPromise(initOptions)
const db = pgp({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});

export { db }
