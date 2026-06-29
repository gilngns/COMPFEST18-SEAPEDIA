const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "SEAPEDIA API jalan" });
});

const swaggerDocument = YAML.load(path.join(__dirname, "../../swagger.yaml"));
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const apiRouter = express.Router();
apiRouter.use("/auth", require("../modules/auth/auth.routes"));
apiRouter.use("/reviews", require("../modules/reviews/review.routes"));
apiRouter.use("/seller", require("../modules/seller/seller.routes"));
apiRouter.use("/catalog", require("../modules/catalog/catalog.routes")); 
apiRouter.use("/buyer", require("../modules/buyer/buyer.routes")); 
apiRouter.use("/cart", require("../modules/cart/cart.routes")); 
apiRouter.use("/orders", require("../modules/orders/orders.routes")); 
apiRouter.use("/categories", require("../modules/category/category.routes")); 
apiRouter.use("/admin", require("../modules/admin/admin.routes"));
apiRouter.use("/discount", require("../modules/discount/discount.routes"));
apiRouter.use("/driver", require("../modules/driver/driver.routes"));

router.use("/api", apiRouter);

module.exports = router;
