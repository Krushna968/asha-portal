const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with mock data...');

    // 1. Create the main Worker (Krushna Rasal)
    const worker = await prisma.worker.upsert({
        where: { mobileNumber: '9321609760' },
        update: { email: 'krushnaemail123@gmail.com' }, // Update the existing mock worker with the new email
        create: {
            employeeId: 'ASHA-10294',
            name: 'Krushna Rasal',
            mobileNumber: '9321609760',
            email: 'krushnaemail123@gmail.com',
            village: 'Kapurthala District',
            totalVisits: 142,
        },
    });

    console.log(`Worker created: ${worker.name}`);

    // 1b. Create/Update Admin User
    const adminEmail = 'krushnaemail123@gmail.com';
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: { password: hashedPassword },
        create: {
            name: 'Krushna (Chief Officer)',
            email: adminEmail,
            password: hashedPassword,
            role: 'CHIEF_OFFICER'
        },
    });
    console.log(`Admin account ${adminEmail} seeded/updated.`);

    // 2. Clear existing sample patients/tasks for this worker to avoid duplicates on re-runs
    await prisma.visitHistory.deleteMany({ where: { workerId: worker.id } });
    await prisma.task.deleteMany({ where: { workerId: worker.id } });
    await prisma.patient.deleteMany({ where: { workerId: worker.id } });

    // 3. Create Sample Patients
    const patient1 = await prisma.patient.create({
        data: {
            name: 'Sunita Devi',
            age: 28,
            category: 'ANC',
            address: 'House 42, Ward 3',
            workerId: worker.id,
        },
    });

    const patient2 = await prisma.patient.create({
        data: {
            name: 'Ramesh Kumar (Child: Aarav)',
            age: 2,
            category: 'IMMUNIZATION',
            address: 'House 18, Ward 1',
            workerId: worker.id,
        },
    });

    // 4. Create Sample Tasks
    await prisma.task.createMany({
        data: [
            {
                title: 'ANC Follow-up with Sunita Devi',
                description: 'Check blood pressure and provide iron supplements.',
                status: 'PENDING',
                priority: 'HIGH',
                dueDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Due tomorrow
                workerId: worker.id,
            },
            {
                title: 'Polio Drop Administration',
                description: 'Ensure Aarav receives second dose of polio drops.',
                status: 'PENDING',
                priority: 'HIGH',
                dueDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // Due in 2 days
                workerId: worker.id,
            },
            {
                title: 'Village Sanitation Meeting',
                description: 'Monthly Panchayat meeting regarding water cleaning.',
                status: 'COMPLETED',
                priority: 'MEDIUM',
                dueDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Due yesterday
                workerId: worker.id,
            }
        ],
    });

    // 5. Create Sample Visit History
    await prisma.visitHistory.create({
        data: {
            workerId: worker.id,
            patientId: patient1.id,
            outcome: 'Vitals normal, prescribed calcium supplements.',
            visitDate: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        },
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
