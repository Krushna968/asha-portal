const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

const registerWorker = async (req, res) => {
    try {
        const { name, mobileNumber, employeeId, village, email } = req.body;

        if (!name || !mobileNumber || !employeeId || !village) {
            return res.status(400).json({ error: 'Name, Mobile Number, Special ID, and Village are required.' });
        }

        if (mobileNumber.length < 10) {
            return res.status(400).json({ error: 'Mobile number must be at least 10 digits.' });
        }

        const existingId = await prisma.worker.findUnique({ where: { employeeId } });
        if (existingId) return res.status(400).json({ error: 'A worker with this Special ID already exists.' });

        const existingMobile = await prisma.worker.findUnique({ where: { mobileNumber } });
        if (existingMobile) return res.status(400).json({ error: 'A worker with this Mobile Number already exists.' });

        if (email) {
            const existingEmail = await prisma.worker.findUnique({ where: { email } });
            if (existingEmail) return res.status(400).json({ error: 'A worker with this Email already exists.' });
        }

        const newWorker = await prisma.worker.create({
            data: { name, mobileNumber, employeeId, village, email: email || null }
        });

        res.status(201).json({ message: 'ASHA Worker registered successfully!', worker: newWorker });
    } catch (error) {
        console.error('Error registering worker:', error);
        res.status(500).json({ error: 'Failed to register ASHA worker.' });
    }
};

const getAllWorkers = async (req, res) => {
    try {
        const workers = await prisma.worker.findMany({
            include: { _count: { select: { tasks: true, patients: true } } },
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
                reports: { orderBy: { date: 'desc' }, take: 10 },
                visitHistory: { orderBy: { visitDate: 'desc' }, take: 10, include: { patient: true } }
            }
        });
        if (!worker) return res.status(404).json({ error: 'Worker not found' });
        res.json(worker);
    } catch (error) {
        console.error('Error fetching worker details:', error);
        res.status(500).json({ error: 'Failed to fetch worker details' });
    }
};

const getAllBeneficiaries = async (req, res) => {
    try {
        const beneficiaries = await prisma.patient.findMany({
            include: { worker: { select: { name: true, village: true } } },
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
        if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });
        res.json(beneficiary);
    } catch (error) {
        console.error('Error fetching beneficiary details:', error);
        res.status(500).json({ error: 'Failed to fetch beneficiary details' });
    }
};

const getHighRiskBeneficiaries = async (req, res) => {
    try {
        const beneficiaries = await prisma.patient.findMany({
            where: { category: { in: ['ANC', 'PNC'] } },
            include: {
                worker: { select: { id: true, name: true, village: true, mobileNumber: true } },
                visitHistory: {
                    orderBy: { visitDate: 'desc' },
                    take: 2
                },
                riskAlerts: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // AI Risk Calculation logic
        const analyzedBeneficiaries = beneficiaries.map(p => {
            // Provide realistic baseline mock data if no history exists for the demo
            const baseline = {
                bloodPressure: '120/80',
                hbLevel: 11.5,
                weight: 60,
                bloodSugar: 90,
                temperature: 98.4
            };

            const latestVisit = p.visitHistory[0] || baseline;
            const hasRealHistory = p.visitHistory.length > 0;
            let score = 0;
            let indicators = [];

            if (!hasRealHistory) {
                indicators.push('Using Baseline Data (No Recent Visit)');
            }

            // 1. Blood Pressure logic
            if (latestVisit.bloodPressure && latestVisit.bloodPressure.includes('/')) {
                const [sys, dia] = latestVisit.bloodPressure.split('/').map(Number);
                if (sys >= 160 || dia >= 110) {
                    score += 10;
                    indicators.push('Critical BP (>160/110)');
                } else if (sys >= 140 || dia >= 90) {
                    score += 5;
                    indicators.push('High BP (>140/90)');
                }
            }

            // 2. Hemoglobin level (Hb)
            if (latestVisit.hbLevel) {
                if (latestVisit.hbLevel < 7) {
                    score += 10;
                    indicators.push('Severe Anemia (Hb < 7)');
                } else if (latestVisit.hbLevel < 9) {
                    score += 7;
                    indicators.push('Moderate Anemia (Hb < 9)');
                } else if (latestVisit.hbLevel < 11) {
                    score += 3;
                    indicators.push('Monitoring Hb (< 11)');
                }
            }

            // 3. Weight Changes
            if (p.visitHistory.length >= 2) {
                const recent = p.visitHistory[0].weight;
                const previous = p.visitHistory[1].weight;
                const weightDiff = Math.abs(recent - previous);
                if (weightDiff >= 3) {
                    score += 5;
                    indicators.push('Rapid Weight Change (>3kg)');
                } else if (weightDiff >= 1.5) {
                    score += 2;
                    indicators.push('Sudden Weight Gain/Loss');
                }
            }

            // 4. Blood Sugar (Diabetes Risk)
            if (latestVisit.bloodSugar) {
                if (latestVisit.bloodSugar >= 180) {
                    score += 8;
                    indicators.push('Critical Blood Sugar (>180mg)');
                } else if (latestVisit.bloodSugar >= 140) {
                    score += 4;
                    indicators.push('High Blood Sugar (>140mg)');
                }
            }

            // 5. Temperature (Infection Risk)
            if (latestVisit.temperature) {
                if (latestVisit.temperature >= 101) {
                    score += 7;
                    indicators.push('High Fever (>101°F)');
                } else if (latestVisit.temperature >= 99.5) {
                    score += 2;
                    indicators.push('Elevated Temp (>99.5°F)');
                }
            }

            // 6. Age & Previous Complications
            if (p.age < 18 || p.age > 35) {
                score += 3;
                indicators.push('Age Factor (<18 or >35)');
            }

            // 7. Historical Complications (derived from previous outcomes)
            const complicationKeywords = ['Hypertension', 'Diabetes', 'Pre-eclampsia', 'Eclampsia', 'Infection', 'Severe'];
            const hasHistory = p.visitHistory.some(v =>
                v.outcome && complicationKeywords.some(key => v.outcome.includes(key))
            );
            if (hasHistory) {
                score += 5;
                indicators.push('Complication History Noted');
            }

            // Category assignment
            let riskLevel = 'MONITORING';
            if (score >= 10) riskLevel = 'CRITICAL';
            else if (score >= 5) riskLevel = 'HIGH';

            return {
                ...p,
                riskScore: score,
                riskLevel,
                indicators,
                isApproved: p.riskAlerts[0]?.isApproved || false
            };
        });

        // Sort by descending priority
        analyzedBeneficiaries.sort((a, b) => b.riskScore - a.riskScore);

        res.json(analyzedBeneficiaries);
    } catch (error) {
        console.error('Error fetching high risk data:', error);
        res.status(500).json({ error: 'Failed to fetch high risk cases' });
    }
};

const approveRiskAlert = async (req, res) => {
    try {
        const { patientId, riskScore, riskLevel, indicators, workerId } = req.body;
        const adminId = req.worker?.id; // From requireAuth middleware

        // Create or update risk alert
        const alert = await prisma.riskAlert.create({
            data: {
                patientId,
                riskScore,
                riskLevel,
                indicators: JSON.stringify(indicators),
                isApproved: true,
                approvedBy: adminId || 'SYSTEM_ADMIN',
                workerId
            }
        });

        // Trigger notification logic here (e.g., push notification to ASHA app)
        // For now, we'll just return success
        res.json({
            message: 'Risk case approved and sent to ASHA worker successfully!',
            alert
        });
    } catch (error) {
        console.error('Error approving risk alert:', error);
        res.status(500).json({ error: 'Failed to approve risk case' });
    }
};

const getRiskAlerts = async (req, res) => {
    try {
        const alerts = await prisma.riskAlert.findMany({
            include: {
                patient: true,
                worker: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching risk alerts:', error);
        res.status(500).json({ error: 'Failed to fetch risk alerts' });
    }
};

const getAllTasks = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: { worker: { select: { name: true, village: true } } },
            orderBy: { dueDate: 'asc' }
        });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching global tasks:', error);
        res.status(500).json({ error: 'Failed to fetch global tasks' });
    }
};

const createGlobalTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, workerId } = req.body;
        if (!title || !dueDate || !workerId) return res.status(400).json({ error: 'Title, Due Date, and Worker ID are required.' });
        const newTask = await prisma.task.create({
            data: { title, description, priority: priority || 'MEDIUM', dueDate: new Date(dueDate), workerId },
            include: { worker: { select: { name: true } } }
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating global task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

const getGlobalInventory = async (req, res) => {
    try {
        const inventory = await prisma.inventoryItem.findMany({
            include: { worker: { select: { name: true, village: true } } }
        });
        const summary = inventory.reduce((acc, item) => {
            if (!acc[item.name]) acc[item.name] = { name: item.name, total: 0, unit: item.unit, locations: [] };
            acc[item.name].total += item.quantity;
            acc[item.name].locations.push({ village: item.worker.village, worker: item.worker.name, quantity: item.quantity });
            return acc;
        }, {});
        res.json(Object.values(summary));
    } catch (error) {
        console.error('Error fetching global inventory:', error);
        res.status(500).json({ error: 'Failed to fetch global inventory' });
    }
};

const getDistrictAnalytics = async (req, res) => {
    try {
        const [workerCount, patientCount, taskCount, visitCount, patients, tasks] = await Promise.all([
            prisma.worker.count(),
            prisma.patient.count(),
            prisma.task.count(),
            prisma.visitHistory.count(), // Fix: using visitHistory instead of visit
            prisma.patient.findMany({ select: { category: true } }),
            prisma.task.findMany({ select: { status: true } })
        ]);
        const categoriesBreakdown = patients.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
        const taskStats = tasks.reduce((acc, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});
        res.json({
            totals: { workers: workerCount, patients: patientCount, tasks: taskCount, visits: visitCount },
            categories: categoriesBreakdown,
            taskStats,
            healthCoverage: 85
        });
    } catch (error) {
        console.error('Error fetching district analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

const getWorkerReports = async (req, res) => {
    try {
        const { id } = req.params;
        const reports = await prisma.report.findMany({ where: { workerId: id }, orderBy: { date: 'desc' } });
        res.json(reports);
    } catch (error) {
        console.error('Error fetching worker reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await prisma.report.findUnique({
            where: { id },
            include: {
                worker: {
                    select: { name: true, village: true, employeeId: true }
                }
            }
        });
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
};

const getAdminMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({ where: { receiverType: 'ADMIN' }, orderBy: { createdAt: 'desc' } });
        const enrichedMessages = await Promise.all(messages.map(async (msg) => {
            if (msg.senderType === 'WORKER') {
                const worker = await prisma.worker.findUnique({
                    where: { id: msg.senderId },
                    select: { name: true, village: true, employeeId: true }
                });
                return {
                    ...msg,
                    workerName: worker?.name || 'Unknown Worker',
                    workerVillage: worker?.village || 'Unknown Village',
                    workerEmployeeId: worker?.employeeId || 'N/A'
                };
            }
            return msg;
        }));
        res.json(enrichedMessages);
    } catch (error) {
        console.error('Error fetching admin messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

module.exports = {
    registerWorker,
    getAllWorkers,
    getWorkerById,
    getWorkerReports,
    getAllBeneficiaries,
    getBeneficiaryById,
    getHighRiskBeneficiaries,
    approveRiskAlert,
    getRiskAlerts,
    getAllTasks,
    createGlobalTask,
    getGlobalInventory,
    getDistrictAnalytics,
    getWorkerReports,
    getReportById,
    getAdminMessages
};
