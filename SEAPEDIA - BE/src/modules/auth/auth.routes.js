const router = require("express").Router();
const controller = require("./auth.controller");
const { authRequired } = require("../../middlewares/auth.middleware");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/select-role", authRequired, controller.selectRole);
router.get("/me", authRequired, controller.me);

module.exports = router;