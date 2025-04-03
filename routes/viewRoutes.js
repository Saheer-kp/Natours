const express = require('express');
const viewConroller = require('./../controllers/viewController');
const loginConroller = require('./../controllers/loginController');
const authConroller = require('./../controllers/authController');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//      tourName: 'The city lights',
//      userName: 'Shaheer'
//     });
//  });

 router.use(authConroller.isloggedIn);

 router.get('/', viewConroller.overView);
 router.get('/tour/:slug', authConroller.protect, viewConroller.tour);

 router.get('/login', loginConroller.login);

module.exports = router;