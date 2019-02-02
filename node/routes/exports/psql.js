const pgp = require('pg-promise');


const db = pgp('postgres://root:password@localhost:5432/root');

//export function that can be treated like class
module.exports.put = function(table, relation){
    console.log(table)

};