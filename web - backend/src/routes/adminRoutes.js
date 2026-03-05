const express = require('express');
const {
    registerWorker,
    getAllWorkers,
    getWorkerById,
    getAllBeneficiaries,
    getBeneficiaryById,
    getHighRiskBeneficiaries
} = require('../controllers/adminController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect admin routes with JWT Auth
router.use(requireAuth);

// Admin specific endpoints
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorkerById);
router.post('/workers', registerWorker);

router.get('/beneficiaries', getAllBeneficiaries);
router.get('/beneficiaries/:id', getBeneficiaryById);

router.get('/high-risk', getHighRiskBeneficiaries);

module.exports = router;
