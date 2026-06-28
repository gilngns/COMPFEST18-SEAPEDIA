const prisma = require("../../config/prisma");

class CategoryRepository {
    async getCategories() {
        return prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    }
}

module.exports = new CategoryRepository();
