
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded" : "Missing");

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function main() {
    console.log("Prisma Client instantiated with explicit URL.");
    try {
        await prisma.$connect();
        console.log("Connected to DB successfully.");
        await prisma.$disconnect();
    } catch (e) {
        console.error("Connection failed:", e);
    }
}

main();
