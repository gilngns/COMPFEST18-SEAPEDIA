const catchAsync = require("../../utils/catchAsync");
const { successResponse } = require("../../utils/response");
const usecase = require('./category.usecase');

exports.getCategories = async (req, res) => {
    try {
        const categories = await usecase.getCategories();
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data kategori' });
    }
};
