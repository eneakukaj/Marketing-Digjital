
import prisma from './db.js'; // lidhja me Prisma

async function testConnection() {
  try {
    const users = await prisma.users.findMany();
    console.log("✅ Connection OK, users:", users);
  } catch (err) {
    console.error("❌ Connection failed", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();