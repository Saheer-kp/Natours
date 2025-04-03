const express = require('express');
//route mouting - assing the route to the router
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// this will use the protect middleware for all the route which are needed to protect, this should be after the un protected routes, because every router functions are also middleware and will run as sequence
router.use(authController.protect); 
router.patch('/update-my-password', authController.changePassword);
router.patch('/update-my-data', userController.updateMyData);
router.delete('/delete-me', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictedTo('admin')); 
router.route('/').get(userController.getUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);


module.exports = router;