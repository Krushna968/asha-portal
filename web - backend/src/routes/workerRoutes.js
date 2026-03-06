const express = require('express');
const { getWorkerProfile, getWorkerRiskAlerts } = require('../controllers/workerController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes here require authentication
router.use(requireAuth);

router.get('/profile', getWorkerProfile);
router.get('/risk-alerts', getWorkerRiskAlerts);
router.get('/krushna', (req, res) => {
    res.json({
        id: 'krushna-rasal',
        name: 'Krushna Rasal',
        employeeId: '#ASH-1001',
        village: 'Central Block',
        status: 'Active',
        role: 'DISTRICT_COORDINATOR'
    });
});

router.get('/krushna/messages', (req, res) => {
    res.json([
        { id: 1, sender: 'Admin', text: 'Hello Krushna, please check the high risk cases in Central Block.', time: '10:00 AM' },
        { id: 2, sender: 'Krushna', text: 'Sure, I will update details by evening.', time: '10:15 AM' }
    ]);
});

module.exports = router;
