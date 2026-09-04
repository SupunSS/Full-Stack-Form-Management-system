const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getAllSubmissions,
  updateSubmission,
  deleteSubmission,
} = require('../controllers/submissionController');
const { verifyToken } = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

// Customer-only
router.post('/', verifyToken, roleGuard('CUSTOMER'), createSubmission);

// Admin-only
router.get('/', verifyToken, roleGuard('ADMIN'), getAllSubmissions);
router.put('/:id', verifyToken, roleGuard('ADMIN'), updateSubmission);
router.delete('/:id', verifyToken, roleGuard('ADMIN'), deleteSubmission);

module.exports = router;