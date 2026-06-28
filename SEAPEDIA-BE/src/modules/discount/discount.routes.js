const router = require("express").Router();
const controller = require("./discount.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

// Guest / Public access
router.get("/", controller.listAvailableDiscounts);

// Buyer only
const buyerOnly = [authRequired, requireRole("BUYER")];
router.post("/validate", ...buyerOnly, controller.validateDiscount);

module.exports = router;
