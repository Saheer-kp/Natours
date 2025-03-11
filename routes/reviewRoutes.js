const express = require("express");
const { reviews } = require("../controllers/reviewController");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");


const router = express.Router({ mergeParams: true });  // mergeParams is set to true inorder to get the tourId(merged)

router.route('/').get(reviews).post(authController.protect, authController.restrictedTo('user'), reviewController.setReviewTourUserIds, reviewController.store);
router.route('/:id').get(reviewController.review).patch(reviewController.updateReview).delete(reviewController.deleteReview);
module.exports = router;
