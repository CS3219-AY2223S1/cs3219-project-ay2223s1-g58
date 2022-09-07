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
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT
});



module.exports =  db ;
