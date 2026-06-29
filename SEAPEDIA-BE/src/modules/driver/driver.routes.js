const router = require("express").Router();
const controller = require("./driver.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { idParamSchema } = require("../../utils/common.validation");

const driverOnly = [authRequired, requireRole("DRIVER")];

router.get("/dashboard", ...driverOnly, controller.getDashboard);
router.get("/jobs", ...driverOnly, controller.getAvailableJobs);
router.get("/jobs/:id", ...driverOnly, validate({ params: idParamSchema }), controller.getJobDetail);
router.get("/deliveries", ...driverOnly, controller.getMyDeliveries);
router.post("/jobs/:id/take", ...driverOnly, validate({ params: idParamSchema }), controller.takeJob);
router.post("/jobs/:id/complete", ...driverOnly, validate({ params: idParamSchema }), controller.completeJob);

module.exports = router;
