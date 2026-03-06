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

// SakhiAI Proxy — forwards chat requests to the mobile backend
app.post('/api/sakhi/chat', async (req, res) => {
    console.log(`[DEBUG] SakhiAI Proxy: ${req.method} ${req.url}`);
    try {
        const MOBILE_BACKEND = process.env.MOBILE_BACKEND_URL || 'http://localhost:5000';
        console.log(`[DEBUG] Forwarding to: ${MOBILE_BACKEND}/api/sakhi/chat`);

        const response = await fetch(`${MOBILE_BACKEND}/api/sakhi/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {})
            },
            body: JSON.stringify(req.body)
        });

        console.log(`[DEBUG] Mobile backend response status: ${response.status}`);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error(`[DEBUG] Mobile backend error:`, errData);
            return res.status(response.status).json(errData || { error: 'Mobile backend failed' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('[DEBUG] SakhiAI proxy error:', error.message);
        res.status(502).json({ reply: 'SakhiAI is currently unavailable. Please ensure the mobile backend is running on port 5000.' });
    }
});

const prisma = require('./lib/prisma');
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
