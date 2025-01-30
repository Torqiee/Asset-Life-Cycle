const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware to authenticate the user
const router = express.Router();

router.post('/check-registration', authController.verifyUserAlreadyRegistered); 

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/signout', authController.signout);

router.get('/user', authMiddleware, authController.getCurrentUser);
router.get('/users', authMiddleware, authController.getAllUsers);
router.patch('/users/:userId/role', authMiddleware, authController.updateUserRole);

router.patch(
	'/send-verification-code',
	authController.sendVerificationCode
);
router.patch(
	'/verify-verification-code',
	authController.verifyVerificationCode
);
router.patch('/change-password', authController.changePassword);
router.patch(
	'/send-forgot-password-code',
	authController.sendForgotPasswordCode
);
router.patch(
	'/verify-forgot-password-code',
	authController.verifyForgotPasswordCode
);

module.exports = router;
