const fs = require('fs');
const path = require('path');

const express = require('express');

const router = express.Router();

const tours = JSON.parse(fs.readFileSync(path.join('dev-data', 'tours.json'), 'utf-8'));

router.route('/')
    .get((req, res) => {
        res.status(200).json({
            status: 'success',
            data: tours
        })
    })

module.exports = router