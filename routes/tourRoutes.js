const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

//also export controller functions as destructured
// const {getTours, getTour} = require('./../controllers/tourController');

//route param middleware - type of middleware which will inspect route param eg:-/:id
// router.param('id', tourController.checkId) ;

const router = express.Router();


router.route('/top-five-cheap')
.get(tourController.topFiveCheap, tourController.getTours)

router.route('/tour-stats')
.get(tourController.tourStats)

router.route('/tour-plan/:year')
.get(tourController.toursPlan)

router.route('/')
.get(authController.protect, tourController.getTours)
.post(tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(tourController.updateTour)
.delete(authController.protect, authController.restrictedTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;