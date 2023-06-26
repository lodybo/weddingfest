import type { Role } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type SeedUser = { name: string; email: string; password: string; role: Role };

const users: SeedUser[] = [
  {
    name: 'Lody',
    email: 'hi@lodybo.nl',
    password: 'lodyiscool',
    role: 'ADMIN',
  },
  {
    name: 'Kaylee',
    email: 'kaylee@drakenfruit.com',
    password: 'kayleeiscool',
    role: 'ADMIN',
  },
  {
    name: 'Arantja',
    email: 'arantja@arantja.nl',
    password: 'arantjaiscool',
    role: 'USER',
  },
];

function createUser({ email, password, role }: SeedUser) {
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: bcrypt.hashSync(password, 10),
        },
      },
      role,
    },
  });
}

async function seed() {
  console.log(`Start seeding ... 🌱`);

  await Promise.all(users.map((user) => createUser(user)));

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
