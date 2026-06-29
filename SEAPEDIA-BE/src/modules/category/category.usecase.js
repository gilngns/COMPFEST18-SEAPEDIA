const AppError = require("../../utils/AppError");
const categoryRepository = require("./category.repository");

const getCategories = async () => {
        return await categoryRepository.getCategories();
    }

module.exports = { getCategories };

