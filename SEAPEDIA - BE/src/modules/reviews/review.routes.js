const router = require("express").Router();
const controller = require("./review.controller");

router.post("/", controller.create);
router.get("/", controller.list);
 
module.exports = router;