import type { Password, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '~/db.server';

export type { User } from '@prisma/client';

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

export function getAllUsers({
  includeRsvps = false,
}: {
  includeRsvps: boolean;
}) {
  return prisma.user.findMany({
    include: {
      rsvp: includeRsvps,
    },
  });
}

export async function createUser(
  name: User['name'],
  email: User['email'],
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function changeUserPassword(
  email: User['email'],
  newPassword: string
) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return prisma.user.update({
    where: {
      email,
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByID(id: string) {
  return prisma.user.delete({ where: { id } });
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash']
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export function changeUserEmail(
  userId: User['id'],
  newEmail: User['email']
): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: newEmail,
    },
  });
}

export function coupleRsvpToUser(
  userId: User['id'],
  rsvpId: User['id']
): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      rsvp: {
        connect: {
          id: rsvpId,
        },
      },
    },
  });
}

export function decoupleRsvpFromUser(userId: User['id']): Promise<User> {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      rsvp: {
        disconnect: true,
      },
    },
  });
}

export function checkUserHasRsvp(userId: User['id']): Promise<boolean> {
  return prisma.user
    .findUnique({
      where: {
        id: userId,
      },
      select: {
        rsvp: true,
      },
    })
    .then((user) => Boolean(user?.rsvp?.id ?? false));
}
