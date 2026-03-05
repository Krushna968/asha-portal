require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial Admin user...');

    // Creating the exact admin user Krushna requested
    const adminEmail = 'krushnaemail123@gmail.com';
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10); // Default password: admin123

    const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        await prisma.admin.create({
            data: {
                name: 'Krushna (Chief Officer)',
                email: adminEmail,
                password: hashedPassword,
                role: 'CHIEF_OFFICER'
            }
        });
        console.log(`Successfully created Admin account for: ${adminEmail}`);
    } else {
        // Update password for existing admin so login works
        await prisma.admin.update({
            where: { email: adminEmail },
            data: { password: hashedPassword }
        });
        console.log(`Admin account ${adminEmail} already exists! Password updated.`);
    }
}

main()
    .catch((e) => {
        console.error('Seeding Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
