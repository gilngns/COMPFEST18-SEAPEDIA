const router = require("express").Router();
const controller = require("./driver.controller");
const { authRequired, requireRole } = require("../../middlewares/auth.middleware");

const driverOnly = [authRequired, requireRole("DRIVER")];

router.get("/dashboard", ...driverOnly, controller.getDashboard);
router.get("/jobs", ...driverOnly, controller.getAvailableJobs);
router.get("/jobs/:id", ...driverOnly, controller.getJobDetail);
router.get("/deliveries", ...driverOnly, controller.getMyDeliveries);
router.post("/jobs/:id/take", ...driverOnly, controller.takeJob);
router.post("/jobs/:id/complete", ...driverOnly, controller.completeJob);

module.exports = router;
