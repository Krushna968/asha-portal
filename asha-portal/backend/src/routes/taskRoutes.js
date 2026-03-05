const express = require('express');
const { getTasks, createTask, updateTaskStatus } = require('../controllers/taskController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes here require authentication
router.use(requireAuth);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTaskStatus);

module.exports = router;
