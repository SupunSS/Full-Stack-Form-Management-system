const express = require('express');
const router = express.Router();
const { register, login, adminLogin, createAdmin } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/admin/create', verifyToken, roleGuard('ADMIN'), createAdmin);

module.exports = router;