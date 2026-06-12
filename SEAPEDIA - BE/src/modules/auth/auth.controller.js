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
    const result = await service.login(req.body);
    res.json({ message: "Login berhasil", ...result });
  } catch (err) {
    next(err);
  }
}

async function selectRole(req, res, next) {
  try {
    const result = await service.selectRole({
      userId: req.user.userId,
      role: req.body.role,
    });
    res.json({ message: "Peran aktif diatur", ...result });
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

module.exports = { register, login, selectRole, me };