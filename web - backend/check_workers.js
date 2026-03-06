const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    const workers = await p.worker.findMany({
        select: { id: true, name: true, employeeId: true, village: true, mobileNumber: true }
    });
    console.log(JSON.stringify(workers, null, 2));
    console.log('Total workers:', workers.length);
}

main().catch(e => console.error(e)).finally(() => p.$disconnect());
