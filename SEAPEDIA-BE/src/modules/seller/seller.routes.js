const router = require("express").Router();
const controller = require("./seller.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const sellerOnly = [authRequired, requireRole("SELLER")];

const upload = require("../../middlewares/upload");

router.post("/store", ...sellerOnly, upload.single("logo"), controller.upsertStore);
router.get("/store/me", ...sellerOnly, controller.getMyStore);
router.get("/store/:id", controller.getPublicStore);

router.post("/products", ...sellerOnly, upload.array("images", 3), controller.createProduct);
router.get("/products", ...sellerOnly, controller.listMyProducts);
router.put("/products/:id", ...sellerOnly, upload.array("images", 3), controller.updateProduct);
router.delete("/products/:id", ...sellerOnly, controller.deleteProduct);

router.get("/wallet", ...sellerOnly, controller.getWallet);
router.get("/wallet/transactions", ...sellerOnly, controller.getWalletTransactions);
router.post("/wallet/withdraw", ...sellerOnly, controller.withdrawFunds);

module.exports = router;