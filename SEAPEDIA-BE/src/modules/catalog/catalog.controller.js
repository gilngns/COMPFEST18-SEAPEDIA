const usecase = require("./catalog.usecase");

async function list(req, res, next) {
  try {
    const result = await usecase.listProducts({ 
      search: req.query.search,
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      sort: req.query.sort,
      locations: req.query.locations,
      rating: req.query.rating,
      conditions: req.query.conditions,
      page: req.query.page,
      limit: req.query.limit
    });
    res.json({ 
      data: result.data, 
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalItems: result.totalItems
    });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const product = await usecase.getProduct(req.params.id);
    res.json({ data: product });
  } catch (err) { next(err); }
}

module.exports = { list, detail };