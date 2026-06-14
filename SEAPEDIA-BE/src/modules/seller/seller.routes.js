const router = require("express").Router();
const controller = require("./seller.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const sellerOnly = [authRequired, requireRole("SELLER")];

const upload = require("../../middlewares/upload");

router.post("/store", ...sellerOnly, upload.single("logo"), controller.upsertStore);
router.get("/store/me", ...sellerOnly, controller.myStore);
router.get("/store/:id", controller.publicStore);

router.post("/products", ...sellerOnly, upload.single("image"), controller.createProduct);
router.get("/products", ...sellerOnly, controller.listMyProducts);
router.put("/products/:id", ...sellerOnly, upload.single("image"), controller.updateProduct);
router.delete("/products/:id", ...sellerOnly, controller.deleteProduct);

module.exports = router;