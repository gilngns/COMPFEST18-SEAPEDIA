const router = require("express").Router();
const controller = require("./discount.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./discount.validation");

router.get("/", controller.listAvailableDiscounts);

const buyerOnly = [authRequired, requireRole("BUYER")];
router.post("/validate", ...buyerOnly, validate(schemas.validateDiscountSchema), controller.validateDiscount);

module.exports = router;
