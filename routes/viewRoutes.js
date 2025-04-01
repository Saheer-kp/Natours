const express = require('express');
const viewConroller = require('./../controllers/viewController');
const loginConroller = require('./../controllers/loginController');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//      tourName: 'The city lights',
//      userName: 'Shaheer'
//     });
//  });
 router.get('/', viewConroller.overView);
 router.get('/tour/:slug', viewConroller.tour);

 router.get('/login', loginConroller.login);

module.exports = router;