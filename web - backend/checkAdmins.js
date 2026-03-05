const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all admins...');
    const admins = await prisma.admin.findMany();
    console.log('Admins found:', admins.map(a => ({ id: a.id, email: a.email, name: a.name, hasPassword: !!a.password })));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
