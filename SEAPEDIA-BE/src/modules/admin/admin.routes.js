const router = require("express").Router();
const controller = require("./admin.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./admin.validation");

const adminOnly = [authRequired, requireRole("ADMIN")];

router.post("/vouchers", ...adminOnly, validate(schemas.createVoucherSchema), controller.createVoucher);
router.post("/promos", ...adminOnly, validate(schemas.createPromoSchema), controller.createPromo);
router.post("/simulate-day", ...adminOnly, controller.simulateDay);

router.get("/vouchers", ...adminOnly, controller.getVouchers);
router.get("/promos", ...adminOnly, controller.getPromos);
router.get("/stats", ...adminOnly, controller.getDashboardStats);
router.get("/orders", ...adminOnly, controller.getOrders);

module.exports = router;
