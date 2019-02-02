const express = require('express');
const router = express.Router();

const {Client} = require('pg');
const client = new Client();

client.connect()

//homepage
router.get('/', (req, res)=>{

    
    var text = 'SELECT COUNT(*) FROM handle_help';

    var handle_help = 0;

    client.query(text,(err,res) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_help = res.rows[0];
            console.log(res.rows[0]);
        }
    });

    text = 'SELECT COUNT(*) FROM handle_criminal_law';

    var handle_crim = 0;

    client.query(text,(err,res) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_crim = res.rows[0];
        }
    });

    text = 'SELECT COUNT(*) FROM handle_personal_injury';

    var handle_injury = 0;

    client.query(text,(err,res) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_injury = res.rows[0];
        }
    });

    text = 'SELECT COUNT(*) FROM handle_unfair_contracts';

    var handle_unfair = 0;

    client.query(text,(err,res) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_unfair = res.rows[0];
        }
    });

    var result = {
        "criminal law": handle_crim,
        "personal injury law": handle_injury,
        "worker's rights law": handle_help,
        "unfair contract law": handle_unfair
    };

    res.send(result);
    
});

module.exports = router;