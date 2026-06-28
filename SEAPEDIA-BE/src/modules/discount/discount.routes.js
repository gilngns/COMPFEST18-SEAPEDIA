const router = require("express").Router();
const controller = require("./discount.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");


router.get("/", controller.listAvailableDiscounts);


const buyerOnly = [authRequired, requireRole("BUYER")];
router.post("/validate", ...buyerOnly, controller.validateDiscount);

module.exports = router;
