const express = require('express');

const {createReview, getAllReviews, getReview, updateReview, deleteReview} = require('../controllers/reviews-handler');
const authenticate = require('../controllers/authenticate');
const {protect, restrict} = authenticate;

const router = express.Router({mergeParams: true});

router.route('/')
    .get(getAllReviews)
    .post(protect, restrict('user'), createReview);

router.route('/:id')
    .get(protect, restrict('user', 'admin'), getReview)
    .delete(protect, restrict('user', 'admin'), deleteReview)
    .patch(protect, restrict('user', 'admin'), updateReview);

module.exports = router;