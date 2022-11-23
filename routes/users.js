const express = require('express');

const {getUser, getUsers, updateUser, deleteUser, forgortPassword, resetPassword, updatePassword, updateUsersData, deleteAccount, myAccount, logout, upload} = require('../controllers/users-handler');
const authenticate = require('../controllers/authenticate');

const {signUp, login, protect, restrict} = authenticate;

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-password', forgortPassword);
router.patch('/reset-password/:resetToken', resetPassword);
router.patch('/update-password', protect, updatePassword);
router.patch('/update-user-account', protect, upload, updateUsersData);
router.delete('/delete-account', protect, deleteAccount);
router.get('/my-account', protect, myAccount);
router.get('/logout', logout);

router.route('/')
    .get(protect, restrict('admin', 'lead-guide'), getUsers)

router.route('/:id')
    .get(protect, restrict('admin'), getUser)
    .patch(protect, restrict('admin'), updateUser)
    .delete(protect, restrict('admin'), deleteUser)

module.exports = router;