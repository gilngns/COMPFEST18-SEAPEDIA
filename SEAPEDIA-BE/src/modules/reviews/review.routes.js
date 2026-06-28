const router = require("express").Router();
const controller = require("./review.controller");

router.post("/", controller.createReview);
router.get("/", controller.listReviews);
 
module.exports = router;