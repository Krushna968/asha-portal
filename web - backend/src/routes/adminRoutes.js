const express = require('express');
const { registerWorker } = require('../controllers/adminController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect admin routes with JWT Auth
router.use(requireAuth);

// Admin specific endpoints
router.post('/workers', registerWorker);

module.exports = router;
