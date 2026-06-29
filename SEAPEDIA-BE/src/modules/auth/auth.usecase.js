const bcrypt = require("bcryptjs");
const authRepository = require("./auth.repository");
const { signToken } = require("../../utils/jwt");
const AppError = require("../../utils/AppError");

const VALID_ROLES = ["BUYER", "SELLER", "DRIVER"];

const register = async ({ username, email, password, roles }) => {
    const cleanRoles = [...new Set(roles)]; 

    const existing = await authRepository.findUserByUsernameOrEmail(username, email);
    if (existing) {
      throw new AppError("Username atau email sudah terdaftar", 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser({ username, email, hashed, cleanRoles });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((r) => r.role),
    };
  }
const login = async ({ email, password }) => {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("Kredensial salah", 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError("Kredensial salah", 401);
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
const selectRole = async ({ userId, role }) => {
    const owned = await authRepository.findUserRole(userId, role);
    if (!owned) {
      throw new AppError("Kamu tidak memiliki peran tersebut", 403);
    }

    const token = signToken({ userId, activeRole: role });
    return { token, activeRole: role };
  }
const addRole = async ({ userId, role }) => {
    if (!VALID_ROLES.includes(role)) {
      throw new AppError(`Peran tidak valid: ${role}`, 400);
    }
    
    const owned = await authRepository.findUserRole(userId, role);
    if (owned) {
      throw new AppError("Kamu sudah memiliki peran tersebut", 409);
    }

    await authRepository.addRoleToUser(userId, role);
    
    const token = signToken({ userId, activeRole: role });
    return { token, activeRole: role };
  }
const getProfile = async (userId) => {
    const user = await authRepository.getUserProfile(userId);
    if (!user) throw new AppError("User tidak ditemukan", 404);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((r) => r.role),
      hasStore: !!user.store,
      walletBalance: user.wallet ? user.wallet.balance : null,
    };
  }

module.exports = { register, login, selectRole, addRole, getProfile };

