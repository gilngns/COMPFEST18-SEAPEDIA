const router = require("express").Router();
const controller = require("./review.controller");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./review.validation");

router.post("/", validate(schemas.createReviewSchema), controller.createReview);
router.get("/", controller.listReviews);
 
module.exports = router;