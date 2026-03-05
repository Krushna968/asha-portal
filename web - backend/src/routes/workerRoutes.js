const express = require('express');
const { getWorkerProfile } = require('../controllers/workerController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes here require authentication
router.use(requireAuth);

router.get('/profile', getWorkerProfile);

module.exports = router;
