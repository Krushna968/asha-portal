const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

const sampleWorkers = [
    { name: 'Sunita Kumari', employeeId: 'ASHA-1001', village: 'Malur Block', mobileNumber: '9876543210' },
    { name: 'Priya Devi', employeeId: 'ASHA-1002', village: 'Hosur North', mobileNumber: '9876543211' },
    { name: 'Rekha Murthy', employeeId: 'ASHA-1003', village: 'Block C South', mobileNumber: '9876543212' },
    { name: 'Fatima Nasser', employeeId: 'ASHA-1004', village: 'East Sector', mobileNumber: '9876543213' },
    { name: 'Anita Singh', employeeId: 'ASHA-1005', village: 'Wakad', mobileNumber: '9876543214' },
    { name: 'Meena Patil', employeeId: 'ASHA-1006', village: 'Hinjewadi', mobileNumber: '9876543215' },
    { name: 'Lakshmi Reddy', employeeId: 'ASHA-1007', village: 'Koregaon Park', mobileNumber: '9876543216' },
    { name: 'Geeta Sharma', employeeId: 'ASHA-1008', village: 'Viman Nagar', mobileNumber: '9876543217' },
    { name: 'Kavita Joshi', employeeId: 'ASHA-1009', village: 'Kharadi', mobileNumber: '9876543218' },
    { name: 'Pooja Deshmukh', employeeId: 'ASHA-1010', village: 'Baner', mobileNumber: '9876543219' },
];

async function main() {
    let added = 0;
    for (const w of sampleWorkers) {
        const exists = await p.worker.findUnique({ where: { mobileNumber: w.mobileNumber } });
        if (!exists) {
            const existsId = await p.worker.findUnique({ where: { employeeId: w.employeeId } });
            if (!existsId) {
                await p.worker.create({ data: w });
                added++;
                console.log(`✅ Added: ${w.name} (${w.employeeId})`);
            } else {
                console.log(`⚠️ Skipped (ID exists): ${w.name}`);
            }
        } else {
            console.log(`⚠️ Skipped (mobile exists): ${w.name}`);
        }
    }
    console.log(`\nDone! Added ${added} new workers.`);

    const total = await p.worker.count();
    console.log(`Total workers in database: ${total}`);
}

main().catch(e => console.error(e)).finally(() => p.$disconnect());
