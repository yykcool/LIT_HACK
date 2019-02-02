const pgp = require('pg-promise');
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'my-database-name',
    user: 'user-name',
    password: 'user-password'
};

const db = pgp(cn);

//export function that can be treated like class
module.exports.put = function(table, relation){
    console.log(table)
};
