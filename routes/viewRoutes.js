const express = require('express');
const viewConroller = require('./../controllers/viewController');
const router = express.Router();

// router.get('/', (req, res) => {
//     res.status(200).render('base', {
//      tourName: 'The city lights',
//      userName: 'Shaheer'
//     });
//  });
 router.get('/', viewConroller.overView);
 router.get('/tour', viewConroller.tour);

module.exports = router;