const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to add hbLevel column to VisitHistory...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "VisitHistory" ADD COLUMN IF NOT EXISTS "hbLevel" DOUBLE PRECISION;`);
        console.log('Successfully added hbLevel column.');

        console.log('Attempting to create RiskAlert table...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "RiskAlert" (
                "id" TEXT NOT NULL,
                "patientId" TEXT NOT NULL,
                "riskScore" DOUBLE PRECISION NOT NULL,
                "riskLevel" TEXT NOT NULL,
                "indicators" JSONB NOT NULL,
                "isApproved" BOOLEAN NOT NULL DEFAULT false,
                "approvedBy" TEXT,
                "workerId" TEXT NOT NULL,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "RiskAlert_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('Successfully created RiskAlert table.');

        console.log('Attempting to add foreign keys...');
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "RiskAlert" ADD CONSTRAINT "RiskAlert_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
            ALTER TABLE "RiskAlert" ADD CONSTRAINT "RiskAlert_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        `).catch(e => console.log('Foreign keys might already exist or failed.'));

    } catch (error) {
        console.error('Error running migrations:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
