const express = require('express');
const {getUser, getUsers, updateUser, deleteUser} = require('../controllers/users-handler');
const authenticate = require('../controllers/authenticate');

const {signUp, login, protect, restrict} = authenticate;

const router = express.Router();

router.route('/signup')
    .post(signUp);

router.post('/login', login);

router.route('/')
    .get(protect, restrict('admin', 'lead-guide'), getUsers)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;