const AppError = require("../../utils/AppError");
const catalogRepository = require("./catalog.repository");

const listProducts = async (filters = {}) => {
    return catalogRepository.findManyProducts(filters);
  }
const getProduct = async (productId) => {
    const product = await catalogRepository.findProductById(productId);
    
    
    if (!product || !product.isActive) {
      throw new AppError("Produk tidak ditemukan", 404);
    }
    
    return product;
  }

module.exports = { listProducts, getProduct };

