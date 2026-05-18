import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('advantage123', salt);

  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@advantage.com' },
    update: {},
    create: {
      emri: 'Admin',
      mbiemri: 'Test',
      email: 'admin@advantage.com',
      password_hash: hashedPassword,
      statusi: 'aktiv',
      userroles: {
        create: { role_id: adminRole.id }
      }
    },
  });

  const managerUser = await prisma.users.upsert({
    where: { email: 'manager@advantage.com' },
    update: {},
    create: {
      emri: 'Manager',
      mbiemri: 'Test',
      email: 'manager@advantage.com',
      password_hash: hashedPassword,
      statusi: 'aktiv',
      userroles: {
        create: { role_id: managerRole.id }
      }
    },
  });

  const regularUser = await prisma.users.upsert({
    where: { email: 'user@advantage.com' },
    update: {},
    create: {
      emri: 'User',
      mbiemri: 'Test',
      email: 'user@advantage.com',
      password_hash: hashedPassword,
      statusi: 'aktiv',
      userroles: {
        create: { role_id: userRole.id } 
      }
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