const prisma = require('../lib/prisma');

const getWorkerProfile = async (req, res) => {
    try {
        // req.worker is populated by the authMiddleware
        const workerId = req.worker.id;

        const workerProfile = await prisma.worker.findUnique({
            where: { id: workerId },
            include: {
                _count: {
                    select: { patients: true, tasks: true }
                }
            }
        });

        if (!workerProfile) {
            return res.status(404).json({ error: 'Worker profile not found' });
        }

        res.json({
            id: workerProfile.id,
            employeeId: workerProfile.employeeId,
            name: workerProfile.name,
            village: workerProfile.village,
            mobileNumber: workerProfile.mobileNumber,
            totalVisits: workerProfile.totalVisits,
            stats: {
                totalPatients: workerProfile._count.patients,
                pendingTasks: workerProfile._count.tasks
            }
        });

    } catch (error) {
        console.error("getWorkerProfile error:", error);
        res.status(500).json({ error: 'Failed to fetch worker profile' });
    }
};

const getWorkerRiskAlerts = async (req, res) => {
    try {
        const workerId = req.worker.id;
        const alerts = await prisma.riskAlert.findMany({
            where: {
                workerId,
                isApproved: true
            },
            include: {
                patient: true
            },
            orderBy: { riskScore: 'desc' }
        });
        res.json(alerts);
    } catch (error) {
        console.error("getWorkerRiskAlerts error:", error);
        res.status(500).json({ error: 'Failed to fetch risk alerts' });
    }
};

module.exports = {
    getWorkerProfile,
    getWorkerRiskAlerts
};
