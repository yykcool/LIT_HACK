const express = require('express');
const router = express.Router();


//homepage
router.get('/', async (req, res)=>{

    const {Client} = require('pg');
    const { Pool } = require('pg')
    const pool = new Pool();


    
    const { handle_help } = await pool.query('SELECT COUNT(*) FROM handle_help');
    const { handle_crim } = await pool.query('SELECT COUNT(*) FROM handle_criminal_law');
    const { handle_injury } = await pool.query('SELECT COUNT(*) FROM handle_personal_injury');
    const { handle_unfair } = await pool.query('SELECT COUNT(*) FROM handle_unfair_contracts');

    var result = {
        "criminal law": handle_crim,
        "personal injury law": handle_injury,
        "worker's rights law": handle_help,
        "unfair contract law": handle_unfair
    };

    res.render('index', {
        "criminal law": handle_crim,
        "personal injury law": handle_injury,
        "worker's rights law": handle_help,
        "unfair contract law": handle_unfair
    })
    
});

module.exports = router;