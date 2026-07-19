import type { UserRole } from '@ims/types';

import { prisma } from '../lib/prisma.js';

export const userRepository = {
  findByEmailWithRole(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  },

  findByIdWithRole(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  },
};

export type UserWithRole = NonNullable<
  Awaited<ReturnType<typeof userRepository.findByEmailWithRole>>
>;

export function toAuthRole(name: string): UserRole {
  return name as UserRole;
}
