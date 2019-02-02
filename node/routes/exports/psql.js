const pgp = require('pg-promise');
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'my-database-name',
    user: 'user-name',
    password: 'user-password'
};

const db = pgp(cn);

module.exports = db;
