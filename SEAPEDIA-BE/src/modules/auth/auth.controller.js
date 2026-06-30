const usecase = require("./auth.usecase");
const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");

// Opsi cookie terpusat — otomatis aman untuk dev (HTTP localhost) & prod (HTTPS cross-site).
// Di production (FE & BE beda domain/subdomain): sameSite "none" + secure wajib,
// kalau enggak cookie httpOnly bakal ditolak browser dan user mental ke login terus.
const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,                       // wajib true saat HTTPS (prod)
  sameSite: isProd ? "none" : "lax",    // "none" untuk cross-site di prod
  maxAge: 7 * 24 * 60 * 60 * 1000,      // 7 hari
  path: "/",
};

// clearCookie HARUS pakai opsi yang sama (kecuali maxAge) — kalau beda, cookie gak kehapus.
const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

const register = catchAsync(async (req, res) => {
  const data = await usecase.register(req.body);
  successResponse(res, 201, "Registrasi berhasil", data);
});

const login = catchAsync(async (req, res) => {
  const data = await usecase.login(req.body);

  res.cookie("token", data.token, COOKIE_OPTIONS);

  const { token, ...responseData } = data;
  successResponse(res, 200, "Login berhasil", responseData);
});

const selectRole = catchAsync(async (req, res) => {
  const data = await usecase.selectRole({ userId: req.user.userId, role: req.body.role });

  res.cookie("token", data.token, COOKIE_OPTIONS);

  successResponse(res, 200, `Role ${data.activeRole} diaktifkan`, { activeRole: data.activeRole });
});

const addRole = catchAsync(async (req, res) => {
  const data = await usecase.addRole({ userId: req.user.userId, role: req.body.role });

  res.cookie("token", data.token, COOKIE_OPTIONS);

  successResponse(res, 200, `Berhasil menambahkan peran ${data.activeRole}`, { activeRole: data.activeRole });
});

const me = catchAsync(async (req, res) => {
  const profile = await usecase.getProfile(req.user.userId);
  successResponse(res, 200, "Profile retrieved", {
    profile,
    activeRole: req.user.activeRole,
  });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie("token", CLEAR_COOKIE_OPTIONS);
  successResponse(res, 200, "Logout berhasil");
});

module.exports = { register, login, selectRole, addRole, me, logout };
