const { z } = require("zod");

const registerSchema = {
  body: z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    roles: z.array(z.enum(["BUYER", "SELLER", "DRIVER"])).min(1, "Minimal satu role dipilih")
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi")
  })
};

const selectRoleSchema = {
  body: z.object({
    role: z.enum(["BUYER", "SELLER", "DRIVER"])
  })
};

const addRoleSchema = {
  body: z.object({
    role: z.enum(["BUYER", "SELLER", "DRIVER"])
  })
};

module.exports = {
  registerSchema,
  loginSchema,
  selectRoleSchema,
  addRoleSchema
};
