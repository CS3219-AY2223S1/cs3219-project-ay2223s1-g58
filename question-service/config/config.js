require('dotenv').config()
const { POSTGRES_HOST, POSTGRES_USER,POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_PORT } = process.env;

module.exports = 
{   
    LOCAL: {
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: 'postgres',
    },
    development: {
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: "localhost",
        port: 5432,
        dialect: 'postgres',
    },
    test: {
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: 'postgres',
    },
    production: {
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: 'postgres',
    }
}
