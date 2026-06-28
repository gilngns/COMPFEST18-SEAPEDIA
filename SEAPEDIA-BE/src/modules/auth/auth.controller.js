const usecase = require("./auth.usecase");

async function register(req, res, next) {
  try {
    const data = await usecase.register(req.body);
    res.status(201).json({ message: "Registrasi berhasil", data });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = await usecase.login(req.body);

    res.cookie("token", data.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: "lax", 
    });

    const { token, ...responseData } = data;

    res.json({ message: "Login berhasil", data: responseData });
  } catch (err) {
    next(err);
  }
}

async function selectRole(req, res, next) {
  try {
    const data = await usecase.selectRole({ userId: req.user.userId, role: req.body.role });

    res.cookie("token", data.token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({ message: `Role ${data.activeRole} diaktifkan`, activeRole: data.activeRole });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const profile = await usecase.getProfile(req.user.userId);
    res.json({
      data: profile,
      activeRole: req.user.activeRole,
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
}

module.exports = { register, login, selectRole, me, logout };