const prisma = require("../../config/prisma");

class AuthRepository {
  async findUserByUsernameOrEmail(username, email) {
    return prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
  }

  async findUserByEmail(email) {
    return prisma.user.findFirst({
      where: { email },
      include: { roles: true },
    });
  }

  async createUser({ username, email, hashed, cleanRoles }) {
    return prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        roles: {
          create: cleanRoles.map((role) => ({ role })),
        },
        wallet: (cleanRoles.includes("BUYER") || cleanRoles.includes("SELLER")) ? { create: {} } : undefined,
      },
      include: { roles: true },
    });
  }

  async findUserRole(userId, role) {
    return prisma.userRole.findUnique({
      where: { userId_role: { userId, role } },
    });
  }

  async addRoleToUser(userId, role) {
    return prisma.userRole.create({
      data: { userId, role },
    });
  }

  async getUserProfile(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true, store: true, wallet: true },
    });
  }
}

module.exports = new AuthRepository();
