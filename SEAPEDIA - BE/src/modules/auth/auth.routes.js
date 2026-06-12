const router = require("express").Router();
const { z } = require("zod");
const controller = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const { authRequired } = require("../../middlewares/auth.middleware");

const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  roles: z.array(z.enum(["BUYER", "SELLER", "DRIVER"])).min(1, "Pilih minimal satu peran"),
});

const loginSchema = z.object({
  identifier: z.string().min(1, "Username atau email harus diisi"),
  password: z.string().min(1, "Kata sandi harus diisi"),
});

const selectRoleSchema = z.object({
  role: z.enum(["BUYER", "SELLER", "DRIVER"], {
    errorMap: () => ({ message: "Peran tidak valid" }),
  }),
});

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/select-role", authRequired, validate(selectRoleSchema), controller.selectRole);
router.get("/me", authRequired, controller.me);
router.post("/logout", controller.logout);

module.exports = router;