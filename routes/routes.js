const express = require('express');
const {tourHandler, overviewHandler} = require('../controllers/routes-handler');

const router = express.Router();

router.get('/', overviewHandler);
router.get('/tour/:slug', tourHandler);

module.exports = router