const router = require("express").Router();
const controller = require("./seller.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./seller.validation");
const { idParamSchema } = require("../../utils/common.validation");

const sellerOnly = [authRequired, requireRole("SELLER")];

const upload = require("../../middlewares/upload");

router.post("/store", ...sellerOnly, upload.single("logo"), validate(schemas.upsertStoreSchema), controller.upsertStore);
router.get("/store/me", ...sellerOnly, controller.getMyStore);
router.get("/store/:id", validate({ params: idParamSchema }), controller.getPublicStore);

router.post("/products", ...sellerOnly, upload.array("images", 3), validate(schemas.createProductSchema), controller.createProduct);
router.get("/products", ...sellerOnly, controller.listMyProducts);
router.put("/products/:id", ...sellerOnly, upload.array("images", 3), validate(schemas.updateProductSchema), controller.updateProduct);
router.delete("/products/:id", ...sellerOnly, validate({ params: idParamSchema }), controller.deleteProduct);

router.get("/wallet", ...sellerOnly, controller.getWallet);
router.get("/wallet/transactions", ...sellerOnly, controller.getWalletTransactions);
router.post("/wallet/withdraw", ...sellerOnly, validate(schemas.withdrawSchema), controller.withdrawFunds);

module.exports = router;