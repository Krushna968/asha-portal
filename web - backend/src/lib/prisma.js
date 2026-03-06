const { PrismaClient } = require('@prisma/client');

// Singleton Prisma instance for Admin Portal Backend
const prisma = new PrismaClient({
    log: ['error'],
});

module.exports = prisma;
