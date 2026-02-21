const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { getCurrentUser, updateCurrentUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Signup Route
router.post('/signup', registerUser);

// Login Route
router.post('/login', loginUser);

router.get('/me', protect, getCurrentUser);
router.put('/update', protect, updateCurrentUser);

module.exports = router;
