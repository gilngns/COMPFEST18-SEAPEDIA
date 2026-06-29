const router = require("express").Router();
const controller = require("./cart.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./cart.validation");
const { idParamSchema } = require("../../utils/common.validation");

const buyerOnly = [authRequired, requireRole("BUYER")];

router.get("/", ...buyerOnly, controller.getCart);
router.post("/", ...buyerOnly, validate(schemas.addToCartSchema), controller.addToCart);
router.put("/:id", ...buyerOnly, validate(schemas.updateCartItemSchema), controller.updateCartItem);
router.delete("/:id", ...buyerOnly, validate({ params: idParamSchema }), controller.removeCartItem);
router.delete("/", ...buyerOnly, controller.clearCart);

module.exports = router;
