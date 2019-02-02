const pgp = require('pg-promise');
const db = pgp('postgress://root:password@db:5432/root');

//export function that can be treated like class
module.exports.db = function(){
    this.put = (table,relation) => {
        console.log(table + " " + relation);
    };

};