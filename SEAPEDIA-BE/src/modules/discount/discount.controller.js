const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require("./discount.usecase");

const listAvailableDiscounts = catchAsync(async (req, res, next) => {
    const data = await usecase.listAvailableDiscounts();
    res.json({ data });
  });

const validateDiscount = catchAsync(async (req, res, next) => {
    const data = await usecase.validateDiscount(req.body.code);
    res.json({ message: "Kode diskon valid", data });
  });

module.exports = {
  listAvailableDiscounts,
  validateDiscount,
};
