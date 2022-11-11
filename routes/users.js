const express = require('express');
const {getUser, getUsers, updateUser, deleteUser, forgortPassword, resetPassword, updatePassword} = require('../controllers/users-handler');
const authenticate = require('../controllers/authenticate');

const {signUp, login, protect} = authenticate;

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgortPassword);
router.patch('/reset-password/:resetToken', resetPassword);
router.patch('/update-password', protect, updatePassword);

router.route('/')
    .get(getUsers)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;