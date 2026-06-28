const router = require("express").Router();
const controller = require("./buyer.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");


const buyerOnly = [authRequired, requireRole("BUYER")];


router.get("/wallet", ...buyerOnly, controller.getWallet);
router.post("/wallet/topup", ...buyerOnly, controller.topUpWallet);
router.get("/wallet/transactions", ...buyerOnly, controller.getWalletTransactions);


router.get("/address", ...buyerOnly, controller.getAddresses);
router.post("/address", ...buyerOnly, controller.addAddress);
router.delete("/address/:id", ...buyerOnly, controller.deleteAddress);
router.put("/address/:id/default", ...buyerOnly, controller.setDefaultAddress);
router.post("/orders/:id/reviews", ...buyerOnly, controller.submitReview);

module.exports = router;
