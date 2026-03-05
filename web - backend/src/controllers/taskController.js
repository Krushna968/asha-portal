const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTasks = async (req, res) => {
    try {
        const workerId = req.worker.id;

        // Fetch all non-completed tasks ordered by due date
        const tasks = await prisma.task.findMany({
            where: {
                workerId: workerId,
            },
            orderBy: {
                dueDate: 'asc'
            }
        });

        res.json(tasks);
    } catch (error) {
        console.error("getTasks error:", error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

const createTask = async (req, res) => {
    try {
        const workerId = req.worker.id;
        const { title, description, priority, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({ error: 'Title and dueDate are required' });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                status: 'PENDING',
                dueDate: new Date(dueDate),
                workerId
            }
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("createTask error:", error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const workerId = req.worker.id;
        const taskId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        // Ensure the task belongs to this specific worker before updating
        const taskOwnerCheck = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!taskOwnerCheck || taskOwnerCheck.workerId !== workerId) {
            return res.status(403).json({ error: 'Not authorized to update this task' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status }
        });

        res.json(updatedTask);
    } catch (error) {
        console.error("updateTaskStatus error:", error);
        res.status(500).json({ error: 'Failed to update task status' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTaskStatus
};
