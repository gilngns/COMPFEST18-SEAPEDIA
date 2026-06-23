const router = require("express").Router();
const controller = require("./buyer.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

// Semua route di module ini hanya untuk BUYER yang login
const buyerOnly = [authRequired, requireRole("BUYER")];

// Wallet
router.get("/wallet", ...buyerOnly, controller.getWallet);
router.post("/wallet/topup", ...buyerOnly, controller.topUpWallet);
router.get("/wallet/transactions", ...buyerOnly, controller.getWalletTransactions);

// Address
router.get("/address", ...buyerOnly, controller.getAddresses);
router.post("/address", ...buyerOnly, controller.addAddress);
router.delete("/address/:id", ...buyerOnly, controller.deleteAddress);
router.put("/address/:id/default", ...buyerOnly, controller.setDefaultAddress);

module.exports = router;
