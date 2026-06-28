const catalogRepository = require("./catalog.repository");

class CatalogUseCase {
  async listProducts(filters = {}) {
    return catalogRepository.findManyProducts(filters);
  }

  async getProduct(productId) {
    const product = await catalogRepository.findProductById(productId);
    
    
    if (!product || !product.isActive) {
      throw { status: 404, message: "Produk tidak ditemukan" };
    }
    
    return product;
  }
}

module.exports = new CatalogUseCase();
