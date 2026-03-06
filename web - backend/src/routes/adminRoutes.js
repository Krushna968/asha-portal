const express = require('express');
const {
    registerWorker,
    getAllWorkers,
    getWorkerById,
    getAllBeneficiaries,
    getBeneficiaryById,
    getHighRiskBeneficiaries,
    getAllTasks,
    createGlobalTask,
    getGlobalInventory,
    getDistrictAnalytics,
    getWorkerReports,
    getReportById,
    getAdminMessages
} = require('../controllers/adminController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect admin routes with JWT Auth
router.use(requireAuth);

// Admin specific endpoints
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorkerById);
router.get('/workers/:id/reports', getWorkerReports);
router.post('/workers', registerWorker);

router.get('/beneficiaries', getAllBeneficiaries);
router.get('/beneficiaries/:id', getBeneficiaryById);

router.get('/high-risk', getHighRiskBeneficiaries);

// Task Management
router.get('/tasks', getAllTasks);
router.post('/tasks', createGlobalTask);

// Inventory
router.get('/inventory', getGlobalInventory);

// Analytics
router.get('/analytics', getDistrictAnalytics);

// Reports
router.get('/reports/:id', getReportById);

// Messages / Forwarded Reports
router.get('/messages', getAdminMessages);

module.exports = router;
