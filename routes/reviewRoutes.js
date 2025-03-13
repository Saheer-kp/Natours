const express = require("express");
const { reviews } = require("../controllers/reviewController");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");


const router = express.Router({ mergeParams: true });  // mergeParams is set to true inorder to get the tourId(merged)

router.use(authController.protect);

router.route('/').get(reviews).
post(
    authController.restrictedTo('user'),
    reviewController.setReviewTourUserIds, 
    reviewController.store
);

router.route('/:id').get(reviewController.review)
.patch(
    authController.restrictedTo('admin', 'user'),
    reviewController.updateReview
)
.delete(
    authController.restrictedTo('admin', 'user'),
    reviewController.deleteReview
);
module.exports = router;
