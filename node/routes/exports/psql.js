const pgp = require('pg-promise');

const cn = {
    host: '127.0.0.1:5432',
    port: 5432,
    database: 'root',
    user: 'root',
    password: 'password'
};

const db = pgp(cn);

//export function that can be treated like class
module.exports.put = function(table, relation){
    console.log(table)

};