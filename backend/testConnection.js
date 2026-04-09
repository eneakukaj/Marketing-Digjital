import prisma from "./database/db.js";

async function test() {
  try {
    await prisma.$connect()
    console.log("Prisma u lidh me MySQL")
  } catch (error) {
    console.error("GABIM", error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()