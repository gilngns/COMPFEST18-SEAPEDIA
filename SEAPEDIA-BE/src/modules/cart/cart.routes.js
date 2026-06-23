const router = require("express").Router();
const controller = require("./cart.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const buyerOnly = [authRequired, requireRole("BUYER")];

router.get("/", ...buyerOnly, controller.getCart);
router.post("/", ...buyerOnly, controller.addToCart);
router.put("/:id", ...buyerOnly, controller.updateCartItem);
router.delete("/:id", ...buyerOnly, controller.removeCartItem);
router.delete("/", ...buyerOnly, controller.clearCart);

module.exports = router;
