const { verifyToken } = require("../utils/jwt");

function authRequired(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Token tidak ada" });
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid atau kadaluarsa" });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user.activeRole) {
      return res
        .status(403)
        .json({ error: "Pilih peran aktif dulu sebelum melanjutkan" });
    }
    if (!allowedRoles.includes(req.user.activeRole)) {
      return res.status(403).json({
        error: `Akses ditolak. Butuh peran: ${allowedRoles.join(" / ")}`,
      });
    }
    next();
  };
}

module.exports = { authRequired, requireRole };