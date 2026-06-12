const service = require("./catalog.service");

async function list(req, res, next) {
  try {
    const products = await service.listProducts({ search: req.query.search });
    res.json({ data: products });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const product = await service.getProduct(req.params.id);
    res.json({ data: product });
  } catch (err) { next(err); }
}

module.exports = { list, detail };