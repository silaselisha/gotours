const express = require('express');
const {getUser, getUsers, updateUser, deleteUser, createUser} = require('../controllers/users-handler');

const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(createUser)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;