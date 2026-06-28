const router = require("express").Router();
const controller = require("./orders.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const buyerOnly = [authRequired, requireRole("BUYER")];
const sellerOnly = [authRequired, requireRole("SELLER")];


router.get("/preview", ...buyerOnly, controller.previewCheckout);
router.post("/checkout", ...buyerOnly, controller.checkout);
router.get("/me", ...buyerOnly, controller.getMyOrders);


router.get("/store", ...sellerOnly, controller.getStoreOrders);
router.put("/store/:id/status", ...sellerOnly, controller.updateOrderStatus);

module.exports = router;
