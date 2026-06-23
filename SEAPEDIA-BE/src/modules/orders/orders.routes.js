const router = require("express").Router();
const controller = require("./orders.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const buyerOnly = [authRequired, requireRole("BUYER")];
const sellerOnly = [authRequired, requireRole("SELLER")];

// Buyer Routes
router.get("/preview", ...buyerOnly, controller.previewCheckout);
router.post("/checkout", ...buyerOnly, controller.checkout);
router.get("/me", ...buyerOnly, controller.getMyOrders);

// Seller Routes
router.get("/store", ...sellerOnly, controller.getStoreOrders);
router.put("/store/:id/status", ...sellerOnly, controller.updateOrderStatus);

module.exports = router;
