const pgPromise = require('pg-promise')
const promise = require('bluebird')
require("dotenv").config();

// pg-promise initialization options:
const initOptions = {
    promiseLib: promise,
    error: function (error, e) {
        if (e.cn) {
            console.log("Error: " + error)
            console.log("CONNECTION:", e.cn);
        }
    }
};


const pgp = pgPromise(initOptions)

const db = pgp({
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres-db',
    port: process.env.POSTGRES_PORT || 5432
});



module.exports =  db ;
