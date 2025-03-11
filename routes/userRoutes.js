const express = require('express');
//route mouting - assing the route to the router
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-my-password', authController.protect, authController.changePassword);
router.patch('/update-my-data', authController.protect, userController.updateMyData);
router.delete('/delete-me', authController.protect, userController.deleteMe);

router.route('/').get(userController.getUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;