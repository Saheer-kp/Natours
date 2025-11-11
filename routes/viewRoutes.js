const express = require('express');
const viewConroller = require('./../controllers/viewController');
const loginConroller = require('./../controllers/loginController');
const authConroller = require('./../controllers/authController');
const { booking } = require('../controllers/bookingController');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//      tourName: 'The city lights',
//      userName: 'Shaheer'
//     });
//  });

//  router.use(authConroller.isloggedIn); this is not using any more, instead using individual route as it is as doing same functionality of protect

router.get('/', booking, authConroller.isloggedIn, viewConroller.overView);
router.get('/tour/:slug', authConroller.protect, viewConroller.tour);
router.get('/my-tours', authConroller.protect, viewConroller.myTours);

router.get('/login', authConroller.isloggedIn, loginConroller.login);
router.get('/signup', authConroller.isloggedIn, loginConroller.signup);
router.get('/profile', authConroller.protect, viewConroller.profile);
router.post(
  '/update-profile',
  authConroller.protect,
  viewConroller.updateProfile
);

module.exports = router;
