const express = require('express');
const {getUser, getUsers, updateUser, deleteUser} = require('../controllers/users-handler');
const authenticate = require('../controllers/authenticate');

const {signUp, login} = authenticate;

const router = express.Router();

router.route('/signup')
    .post(signUp);

router.route('/')
    .get(getUsers)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;