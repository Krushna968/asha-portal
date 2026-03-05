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

module.exports = { registerWorker };
