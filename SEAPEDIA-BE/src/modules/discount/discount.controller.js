const usecase = require("./discount.usecase");

async function listAvailableDiscounts(req, res, next) {
  try {
    const data = await usecase.listAvailableDiscounts();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function validateDiscount(req, res, next) {
  try {
    const data = await usecase.validateDiscount(req.body.code);
    res.json({ message: "Kode diskon valid", data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAvailableDiscounts,
  validateDiscount,
};
