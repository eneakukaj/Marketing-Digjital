import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.roles.upsert({
    where: { normalized_name: 'ADMIN' },
    update: {},
    create: {
      emertimi: 'Admin',
      pershkrimi: 'System administrator',
      normalized_name: 'ADMIN',
    },
  });

  const managerRole = await prisma.roles.upsert({
    where: { normalized_name: 'MANAGER' },
    update: {},
    create: {
      emertimi: 'Manager',
      pershkrimi: 'Campaign manager',
      normalized_name: 'MANAGER',
    },
  });

  const userRole = await prisma.roles.upsert({
    where: { normalized_name: 'USER' },
    update: {},
    create: {
      emertimi: 'User',
      pershkrimi: 'Regular application user',
      normalized_name: 'USER',
    },
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });