const router = require("express").Router();
const controller = require("./auth.controller");
const validate = require("../../middlewares/validate.middleware");
const { authRequired } = require("../../middlewares/auth.middleware");
const schemas = require("./auth.validation");

router.post("/register", validate(schemas.registerSchema), controller.register);
router.post("/login", validate(schemas.loginSchema), controller.login);
router.post("/select-role", authRequired, validate(schemas.selectRoleSchema), controller.selectRole);
router.post("/add-role", authRequired, validate(schemas.addRoleSchema), controller.addRole);
router.get("/me", authRequired, controller.me);
router.post("/logout", controller.logout);

module.exports = router;