import { ATTENDANCE, PrismaClient } from '@prisma/client';
import { fakerNL as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function createRSVPs() {
  console.log('Retrieving users from database...');
  const users = await prisma.user.findMany();
  const userID = faker.helpers.shuffle(users.map((user) => user.id));

  console.log('Creating RSVPs...');
  return Promise.all(userID.map((userId) => createRSVP({ userId })));
}

function createRSVP({ userId }: { userId: string }) {
  const attendance: ATTENDANCE = faker.helpers.arrayElement([ATTENDANCE.NONE, ATTENDANCE.EVENING, ATTENDANCE.ALL_DAY]);
  return prisma.rsvp.create({
    data: {
      name: faker.person.fullName(),
      attendance,
      camping: attendance !== ATTENDANCE.NONE ? faker.datatype.boolean() : false,
      diet: faker.helpers.arrayElement([null, null, null, 'geen', 'vegetarisch', 'vegan', 'gluten-vrij', 'lactose-vrij', 'halal', 'noten-vrij']),
      remarks: faker.helpers.arrayElement([null, faker.lorem.sentence()]),
      userId,
    }
  });
}
