const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./catalog.usecase");

const list = catchAsync(async (req, res, next) => {
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
  });

const detail = catchAsync(async (req, res, next) => {
    const product = await usecase.getProduct(req.params.id);
    res.json({ data: product });
  });

module.exports = { list, detail };