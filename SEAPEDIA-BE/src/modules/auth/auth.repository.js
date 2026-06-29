const prisma = require("../../config/prisma");

const findUserByUsernameOrEmail = async (username, email) => {
    return prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
  }
const findUserByEmail = async (email) => {
    return prisma.user.findFirst({
      where: { email },
      include: { roles: true },
    });
  }
const createUser = async ({ username, email, hashed, cleanRoles }) => {
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
const findUserRole = async (userId, role) => {
    return prisma.userRole.findUnique({
      where: { userId_role: { userId, role } },
    });
  }
const addRoleToUser = async (userId, role) => {
    return prisma.userRole.create({
      data: { userId, role },
    });
  }
const getUserProfile = async (userId) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true, store: true, wallet: true },
    });
  }

module.exports = { findUserByUsernameOrEmail, findUserByEmail, createUser, findUserRole, addRoleToUser, getUserProfile };

