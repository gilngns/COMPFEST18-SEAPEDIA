const categoryRepository = require("./category.repository");

class CategoryUseCase {
    async getCategories() {
        return await categoryRepository.getCategories();
    }
}

module.exports = new CategoryUseCase();
