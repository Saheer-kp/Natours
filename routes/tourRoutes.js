const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('../routes/reviewRoutes');

//also export controller functions as destructured
// const {getTours, getTour} = require('./../controllers/tourController');

//route param middleware - type of middleware which will inspect route param eg:-/:id
// router.param('id', tourController.checkId) ;

const router = express.Router();

//nested routes -- indicating parent and chile relation
//  router.route('/:id/reviews')
// .post(authController.protect, authController.restrictedTo('user'), reviewController.store);
   /******      ANOTHER VERSION OF NESTED ROUTES   */

router.use('/:tourId/reviews', reviewRouter);


router.route('/top-five-cheap')
.get(tourController.topFiveCheap, tourController.getTours)

router.route('/tour-stats')
.get(tourController.tourStats);


router.route('/tour-plan/:year').get(
   authController.protect, 
   authController.restrictedTo('admin', 'lead-guide', 'guide'),
   tourController.toursPlan
);

//nearby tours
router.route('/tours-within/:distance/center/:latlng/unit/:unit')
.get(tourController.toursWithin);

//tours with distances from the purticular location
router.route('/tours-distances/:latlng/unit/:unit')
.get(tourController.distances);

router.route('/')
.get(tourController.getTours)
.post(
   authController.protect,
   authController.restrictedTo('admin', 'lead-guide'),
   tourController.createTour
);

router.route('/:id').get(tourController.getTour).patch(
   tourController.updateTour,
   authController.protect, 
   authController.restrictedTo('admin', 'lead-guide')
)
.delete(authController.protect, authController.restrictedTo('admin', 'lead-guide'), tourController.deleteTour);



module.exports = router;