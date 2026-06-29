const router = require("express").Router();
const controller = require("./orders.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./orders.validation");

const buyerOnly = [authRequired, requireRole("BUYER")];
const sellerOnly = [authRequired, requireRole("SELLER")];


router.get("/preview", ...buyerOnly, validate(schemas.previewCheckoutSchema), controller.previewCheckout);
router.post("/checkout", ...buyerOnly, validate(schemas.checkoutSchema), controller.checkout);
router.get("/me", ...buyerOnly, controller.getMyOrders);


router.get("/store", ...sellerOnly, controller.getStoreOrders);
router.put("/store/:id/status", ...sellerOnly, validate(schemas.updateOrderStatusSchema), controller.updateOrderStatus);

module.exports = router;
