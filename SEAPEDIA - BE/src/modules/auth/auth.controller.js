const service = require("./auth.service");

async function register(req, res, next) {
  try {
    const result = await service.register(req.body);
    res.status(201).json({ message: "Registrasi berhasil", data: result });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { token, ...result } = await service.login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });
    res.json({ message: "Login berhasil", token, ...result });
  } catch (err) {
    next(err);
  }
}

async function selectRole(req, res, next) {
  try {
    const { token, ...result } = await service.selectRole({
      userId: req.user.userId,
      role: req.body.role,
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "Peran aktif diatur", token, ...result });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const profile = await service.getProfile(req.user.userId);
    res.json({ data: profile, activeRole: req.user.activeRole });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logout berhasil" });
}

module.exports = { register, login, selectRole, me, logout };