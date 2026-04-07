import { PrismaClient } from '@prisma/client'

// Mos shto asgjë brenda kllapave ()
const prisma = new PrismaClient()

async function test() {
  try {
    // Kjo tenton të bëjë një query të thjeshtë për të parë nëse punon
    await prisma.$connect()
    console.log("------------------------------------------")
    console.log("✅ SUKSES: Prisma u lidh me MySQL!")
    console.log("------------------------------------------")
    
    // Opsionale: provo të marrësh diçka nga një tabelë (p.sh. User)
    // const users = await prisma.user.findMany()
    // console.log("Të dhënat:", users)

  } catch (error) {
    console.error("❌ GABIM GJATË LIDHJES:", error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()