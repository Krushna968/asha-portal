const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'ASHA Backend is running locally' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/worker', workerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function seedAdminOnStartup() {
    try {
        const adminEmail = 'krushnaemail123@gmail.com';
        const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.admin.create({
                data: {
                    name: 'Krushna (Chief Officer)',
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'CHIEF_OFFICER'
                }
            });
            console.log(`✅ Admin account ${adminEmail} created on startup.`);
        } else if (!existingAdmin.password) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await prisma.admin.update({
                where: { email: adminEmail },
                data: { password: hashedPassword }
            });
            console.log(`✅ Admin account ${adminEmail} password updated on startup.`);
        } else {
            console.log(`ℹ️ Admin account ${adminEmail} already exists.`);
        }
    } catch (error) {
        console.error('❌ Failed to seed admin on startup:', error.message);
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    seedAdminOnStartup();
}).on('error', (err) => {
    console.error('Server failed to start:', err.message);
});
