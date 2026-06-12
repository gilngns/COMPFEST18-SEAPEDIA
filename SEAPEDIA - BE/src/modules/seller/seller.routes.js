const router = require("express").Router();
const controller = require("./seller.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const sellerOnly = [authRequired, requireRole("SELLER")];

router.post("/store", ...sellerOnly, controller.upsertStore);
router.get("/store/me", ...sellerOnly, controller.myStore);
router.get("/store/:id", controller.publicStore);

router.post("/products", ...sellerOnly, controller.createProduct);
router.get("/products", ...sellerOnly, controller.listMyProducts);
router.put("/products/:id", ...sellerOnly, controller.updateProduct);
router.delete("/products/:id", ...sellerOnly, controller.deleteProduct);

module.exports = router;