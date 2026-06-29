const prisma = require("../../config/prisma");

const getCategories = async () => {
        return prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    }

module.exports = { getCategories };

