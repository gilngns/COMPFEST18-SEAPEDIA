const express = require('express');
const router = express.Router();
const { getCategories } = require('./category.controller');

router.get('/', getCategories);

module.exports = router;
