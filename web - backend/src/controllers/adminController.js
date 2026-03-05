const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerWorker = async (req, res) => {
    try {
        const { name, mobileNumber, employeeId, village, email } = req.body;

        // Basic validation
        if (!name || !mobileNumber || !employeeId || !village) {
            return res.status(400).json({ error: 'Name, Mobile Number, Special ID, and Village are required.' });
        }

        if (mobileNumber.length < 10) {
            return res.status(400).json({ error: 'Mobile number must be at least 10 digits.' });
        }

        // Check if employeeId already exists
        const existingId = await prisma.worker.findUnique({
            where: { employeeId }
        });
        if (existingId) {
            return res.status(400).json({ error: 'A worker with this Special ID already exists.' });
        }

        // Check if mobileNumber already exists
        const existingMobile = await prisma.worker.findUnique({
            where: { mobileNumber }
        });
        if (existingMobile) {
            return res.status(400).json({ error: 'A worker with this Mobile Number already exists.' });
        }

        // If an email is provided, check if it exists
        if (email) {
            const existingEmail = await prisma.worker.findUnique({
                where: { email }
            });
            if (existingEmail) {
                return res.status(400).json({ error: 'A worker with this Email already exists.' });
            }
        }

        // Create the new worker
        const newWorker = await prisma.worker.create({
            data: {
                name,
                mobileNumber,
                employeeId,
                village,
                email: email || null,
            }
        });

        res.status(201).json({
            message: 'ASHA Worker registered successfully!',
            worker: newWorker
        });
    } catch (error) {
        console.error('Error registering worker:', error);
        res.status(500).json({ error: 'Failed to register ASHA worker. Please try again later.' });
    }
};

const getAllWorkers = async (req, res) => {
    try {
        const workers = await prisma.worker.findMany({
            include: {
                _count: {
                    select: { tasks: true, patients: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(workers);
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).json({ error: 'Failed to fetch workers' });
    }
};

const getWorkerById = async (req, res) => {
    try {
        const { id } = req.params;
        const worker = await prisma.worker.findUnique({
            where: { id },
            include: {
                tasks: { orderBy: { dueDate: 'desc' }, take: 10 },
                patients: { take: 10 },
                visitHistory: { orderBy: { visitDate: 'desc' }, take: 10, include: { patient: true } }
            }
        });

        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        res.json(worker);
    } catch (error) {
        console.error('Error fetching worker details:', error);
        res.status(500).json({ error: 'Failed to fetch worker details' });
    }
};

const getAllBeneficiaries = async (req, res) => {
    try {
        const beneficiaries = await prisma.patient.findMany({
            include: {
                worker: { select: { name: true, village: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(beneficiaries);
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        res.status(500).json({ error: 'Failed to fetch beneficiaries' });
    }
};

const getBeneficiaryById = async (req, res) => {
    try {
        const { id } = req.params;
        const beneficiary = await prisma.patient.findUnique({
            where: { id },
            include: {
                worker: true,
                visitHistory: { orderBy: { visitDate: 'desc' }, include: { worker: true } }
            }
        });

        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        res.json(beneficiary);
    } catch (error) {
        console.error('Error fetching beneficiary details:', error);
        res.status(500).json({ error: 'Failed to fetch beneficiary details' });
    }
};

const getHighRiskBeneficiaries = async (req, res) => {
    try {
        // High risk criteria: 
        // 1. ANC/PNC category
        // 2. Abnormal health markers (e.g., BP > 140/90, weight loss, etc.) 
        // For now, let's fetch all ANC/PNC and include their latest visit history
        const beneficiaries = await prisma.patient.findMany({
            where: {
                category: { in: ['ANC', 'PNC'] }
            },
            include: {
                worker: { select: { name: true, village: true } },
                visitHistory: {
                    orderBy: { visitDate: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Filter for actual "high risk" based on visit data if available
        // Simple logic for now: all ANC/PNC are flagged, but we highlight abnormal ones
        res.json(beneficiaries);
    } catch (error) {
        console.error('Error fetching high risk data:', error);
        res.status(500).json({ error: 'Failed to fetch high risk cases' });
    }
};

module.exports = {
    registerWorker,
    getAllWorkers,
    getWorkerById,
    getAllBeneficiaries,
    getBeneficiaryById,
    getHighRiskBeneficiaries
};
