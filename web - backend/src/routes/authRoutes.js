const express = require('express');
const { googleLogin, passwordLogin } = require('../controllers/authController');

const router = express.Router();

// Google token auth endpoint
router.post('/google', googleLogin);

// Manual credentials auth endpoint
router.post('/login', passwordLogin);

module.exports = router;
