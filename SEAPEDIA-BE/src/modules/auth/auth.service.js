const bcrypt = require("bcryptjs");
const prisma = require("../../config/prisma");
const { signToken } = require("../../utils/jwt");

const VALID_ROLES = ["BUYER", "SELLER", "DRIVER"];

async function register({ username, email, password, roles }) {
  if (!username || !email || !password) {
    throw { status: 400, message: "Username, email, dan password wajib diisi" };
  }
  if (!Array.isArray(roles) || roles.length === 0) {
    throw { status: 400, message: "Pilih minimal satu peran" };
  }
  const cleanRoles = [...new Set(roles)]; 
  for (const r of cleanRoles) {
    if (!VALID_ROLES.includes(r)) {
      throw { status: 400, message: `Peran tidak valid: ${r}` };
    }
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    throw { status: 409, message: "Username atau email sudah terdaftar" };
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
      roles: {
        create: cleanRoles.map((role) => ({ role })),
      },
      wallet: cleanRoles.includes("BUYER") ? { create: {} } : undefined,
    },
    include: { roles: true },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map((r) => r.role),
  };
}

async function login({ email, password }) {
  if (!email || !password) {
    throw { status: 400, message: "Email dan password wajib diisi" };
  }

  const user = await prisma.user.findFirst({
    where: { email },
    include: { roles: true },
  });
  if (!user) {
    throw { status: 401, message: "Kredensial salah" };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: "Kredensial salah" };
  }

  const roles = user.roles.map((r) => r.role);

  const activeRole = roles.length === 1 ? roles[0] : null;

  const token = signToken({ userId: user.id, activeRole });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
    roles,
    activeRole,                          
    needRoleSelection: roles.length > 1, 
  };
}

async function selectRole({ userId, role }) {
  const owned = await prisma.userRole.findUnique({
    where: { userId_role: { userId, role } },
  });
  if (!owned) {
    throw { status: 403, message: "Kamu tidak memiliki peran tersebut" };
  }

  const token = signToken({ userId, activeRole: role });
  return { token, activeRole: role };
}

async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true, store: true, wallet: true },
  });
  if (!user) throw { status: 404, message: "User tidak ditemukan" };

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles.map((r) => r.role),
    hasStore: !!user.store,
    walletBalance: user.wallet ? user.wallet.balance : null,
  };
}

module.exports = { register, login, selectRole, getProfile };