const router = require("express").Router();
const controller = require("./buyer.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./buyer.validation");
const { idParamSchema } = require("../../utils/common.validation");

const buyerOnly = [authRequired, requireRole("BUYER")];


router.get("/wallet", ...buyerOnly, controller.getWallet);
router.post("/wallet/topup", ...buyerOnly, validate(schemas.topUpSchema), controller.topUpWallet);
router.get("/wallet/transactions", ...buyerOnly, controller.getWalletTransactions);


router.get("/address", ...buyerOnly, controller.getAddresses);
router.post("/address", ...buyerOnly, validate(schemas.addAddressSchema), controller.addAddress);
router.delete("/address/:id", ...buyerOnly, validate({ params: idParamSchema }), controller.deleteAddress);
router.put("/address/:id/default", ...buyerOnly, validate({ params: idParamSchema }), controller.setDefaultAddress);
router.post("/orders/:id/reviews", ...buyerOnly, validate(schemas.submitReviewSchema), controller.submitReview);

module.exports = router;
