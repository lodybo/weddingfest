import type { Role, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { fakerNL as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

type SeedUser = { name: string; email: string; password: string; role: Role };

const adminUsers: SeedUser[] = [
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
    role: 'ADMIN',
  },
];

const users = Array.from<unknown, SeedUser>({ length: 50 }, () => {
  const firstName = faker.person.firstName();
  const fullName = faker.person.fullName({ firstName });

  return {
    name: fullName,
    email: faker.internet.email(),
    password: `${firstName}iscool`,
    role: 'USER',
  }
});

export function createUsers() {
  console.log('Creating users...');

  return Promise.all([
    Promise.all(adminUsers.map((user) => createUser(user))),
    Promise.all(users.map((user) => createUser(user))),
  ]);
}

function createUser({ name, email, password, role }: SeedUser) {
  return prisma.user.create({
    data: {
      name,
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
