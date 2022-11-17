const express = require('express');
const {tourHandler, overviewHandler, loginHandler, signupHandler} = require('../controllers/routes-handler');
const {protect, isLoggedIn} = require('../controllers/authenticate')

const router = express.Router();

router.use(isLoggedIn);

router.get('/', overviewHandler);
router.get('/tour/:slug', protect, tourHandler);
router.get('/login', loginHandler);
router.get('/signup', signupHandler);

module.exports = router