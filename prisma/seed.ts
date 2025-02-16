import { PrismaClient } from '@prisma/client';
import { createUsers } from './seed-users';
import { createRSVPs } from './seed-rsvps';

const prisma = new PrismaClient();

async function seed() {
  console.log(`Start seeding ... 🌱`);

  await createUsers();
  await createRSVPs();

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
