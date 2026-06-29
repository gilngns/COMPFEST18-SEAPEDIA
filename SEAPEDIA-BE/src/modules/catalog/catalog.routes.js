const router = require("express").Router();
const controller = require("./catalog.controller");
const validate = require("../../middlewares/validate.middleware");
const schemas = require("./catalog.validation");
const { idParamSchema } = require("../../utils/common.validation");

router.get("/", validate(schemas.listProductsSchema), controller.list);
router.get("/:id", validate({ params: idParamSchema }), controller.detail);

module.exports = router;