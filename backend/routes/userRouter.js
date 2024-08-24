import express from 'express';
import userCtrl from '../controllers/userCtrl.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', userCtrl.registerUser);

// Login
router.post('/login', userCtrl.loginUser);

// Verify Token
router.get('/verify', userCtrl.verifiedToken);

export default router;
