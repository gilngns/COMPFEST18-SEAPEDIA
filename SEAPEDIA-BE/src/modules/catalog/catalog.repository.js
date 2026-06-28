const prisma = require("../../config/prisma");

class CatalogRepository {
  async findManyProducts({ search, categoryId, minPrice, maxPrice, sort, locations, rating, conditions, page = 1, limit = 8 }) {
    const where = { isActive: true, stock: { gt: 0 } };

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (conditions) {
      const condArr = conditions.split(',').filter(Boolean);
      if (condArr.length > 0) {
        where.condition = { in: condArr };
      }
    }
    if (locations) {
      const locArr = locations.split(',').filter(Boolean);
      let cities = [];
      if (locArr.includes("jabodetabek")) cities.push("Jakarta", "Bogor", "Depok", "Tangerang", "Bekasi");
      if (locArr.includes("bandung")) cities.push("Bandung", "Bandung Raya");
      if (locArr.includes("surabaya")) cities.push("Surabaya");
      
      if (cities.length > 0) {
        where.store = { city: { in: cities } };
      }
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "Harga: Rendah - Tinggi") orderBy = { price: "asc" };
    else if (sort === "Harga: Tinggi - Rendah") orderBy = { price: "desc" };

    let products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        images: true,
        condition: true,
        categoryId: true,
        category: { select: { id: true, name: true, icon: true } },
        store: { select: { id: true, name: true, city: true } },
        reviews: { select: { rating: true } }
      },
      orderBy,
    });

    if (rating === 'true') {
      products = products.filter(p => {
        if (!p.reviews || p.reviews.length === 0) return false;
        const avg = p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length;
        return avg >= 4;
      });
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    
    const paginatedProducts = products.slice(startIndex, endIndex);
    const totalPages = Math.ceil(products.length / limitNum);

    return {
      data: paginatedProducts,
      totalPages: totalPages === 0 ? 1 : totalPages,
      currentPage: pageNum,
      totalItems: products.length
    };
  }

  async findProductById(productId) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        isActive: true,
        images: true,
        store: { select: { id: true, name: true, description: true } },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            buyer: { select: { username: true } }
          },
          orderBy: { createdAt: "desc" }
        }
      },
    });
  }
}

module.exports = new CatalogRepository();
