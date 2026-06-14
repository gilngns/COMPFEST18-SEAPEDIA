const router = require("express").Router();
const controller = require("./catalog.controller");

router.get("/", controller.list);
router.get("/:id", controller.detail);

module.exports = router;