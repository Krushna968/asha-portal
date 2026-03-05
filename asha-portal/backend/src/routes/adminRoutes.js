const { registerWorker, getAllWorkers, getWorkerById } = require('../controllers/adminController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect admin routes with JWT Auth
router.use(requireAuth);

// Admin specific endpoints
router.get('/workers', getAllWorkers);
router.get('/workers/:id', getWorkerById);
router.post('/workers', registerWorker);

module.exports = router;
