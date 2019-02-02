const express = require('express');
const router = express.Router();

all_done = [false, false, false, false]
var result = {
    "criminal law": 0,
    "personal injury law": 0,
    "worker's rights law": 0,
    "unfair contract law": 0
};

//homepage
router.get('/', (req, res)=>{

    const {Client} = require('pg');
    const client = new Client();

    client.connect()

    
    var text = 'SELECT COUNT(*) FROM handle_help';
    var handle_help = 0;
    client.query(text,(err,res2) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_help = res.rows[0];
            console.log(res.rows[0]);
            all_done[0] = true
            result["worker's rights law"] = handle_help
            render(res, result)
        }
    });

    text = 'SELECT COUNT(*) FROM handle_criminal_law';

    var handle_crim = 0;

    client.query(text,(err,res2) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_crim = res.rows[0];
            all_done[1] = true
            result["criminal law"] = handle_crim
            render(res, result)
        }
    });

    text = 'SELECT COUNT(*) FROM handle_personal_injury';

    var handle_injury = 0;

    client.query(text,(err,res2) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_injury = res.rows[0];
            all_done[2] = true
            result["personal injury law"] = handle_injury
            render(res, result)
        }
    });

    text = 'SELECT COUNT(*) FROM handle_unfair_contracts';

    var handle_unfair = 0;

    client.query(text,(err,res2) => {
        if(err){
            console.log(err.stack);
        } else {
            handle_unfair = res.rows[0];
            all_done[3] = true
            result["unfair contract law"] = handle_unfair
            render(res, result)
        }
    });

    // var result = {
    //     "criminal law": handle_crim,
    //     "personal injury law": handle_injury,
    //     "worker's rights law": handle_help,
    //     "unfair contract law": handle_unfair
    // };

    // res.render('index', { 
    //     title: 'numbers', 
    //     message: JSON.stringify(result) })

    
});

function render(res, result) {
    for (var i in all_done) {
        if (!all_done[i]) {
            return
        }
    }

    res.render('index', { 
        title: 'numbers', 
        message: JSON.stringify(result) })
}

module.exports = router;