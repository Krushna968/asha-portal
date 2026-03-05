const admin = require('firebase-admin');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Initialize Firebase Admin (Only initialize once)
if (!admin.apps.length) {
    const serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'Missing Firebase ID token' });

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;

        if (!email) {
            return res.status(400).json({ error: 'No email found in Google token' });
        }

        // Look up Admin by email
        const adminUser = await prisma.admin.findUnique({
            where: { email: email }
        });

        if (!adminUser) {
            return res.status(403).json({ error: 'Access Denied: You are not registered as an Administrator.' });
        }

        // Generate local JWT token for Admin API requests
        const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email, role: adminUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            worker: { // Keep the 'worker' key for frontend compatibility
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });

    } catch (error) {
        console.error('Firebase Auth Error:', error);
        res.status(401).json({ error: 'Invalid Google login token' });
    }
}

const passwordLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[DEBUG] Login attempt for: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    try {
        // Look up Admin by email
        const adminUser = await prisma.admin.findUnique({
            where: { email: email }
        });

        if (!adminUser) {
            console.log(`[DEBUG] Admin not found for email: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log(`[DEBUG] Admin found: ${adminUser.email}, hasPassword: ${!!adminUser.password}`);

        // Check if manual password exists
        if (!adminUser.password) {
            console.log(`[DEBUG] Admin has no password set.`);
            return res.status(401).json({ error: 'Manual login not set up for this account. Please use Google Login.' });
        }

        // Verify password
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, adminUser.password);
        console.log(`[DEBUG] Password match result: ${isMatch}`);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate local JWT token
        const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email, role: adminUser.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            worker: {
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });

    } catch (error) {
        console.error('Password Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
}

module.exports = { googleLogin, passwordLogin };
