const express = require('express');
const {getUser, getUsers, updateUser, deleteUser, forgortPassword, resetPassword} = require('../controllers/users-handler');
const authenticate = require('../controllers/authenticate');

const {signUp, login, protect, restrict} = authenticate;

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgortPassword);
router.post('/reset-password/:resetToken', resetPassword);

router.route('/')
    .get(protect, restrict('admin', 'lead-guide'), getUsers)

router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router;