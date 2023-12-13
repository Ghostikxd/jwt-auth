const ApiError = require('../exceptions/api-error')

const categoryService = require('../service/category-service')
const { validationResult } = require('express-validator')

class CategoryController {
	async create(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
			}
			const { name } = req.body
			const categoryData = await categoryService.create(name)
			return res.json(categoryData)
		} catch (error) {
			next(error)
		}
	}
	async getCategories(req, res, next) {
		try {
			const categoryId = req.query.categoryId
			const categoriesData = await categoryService.getCategories({ categoryId })
			return res.json(categoriesData)
		} catch (error) {
			next(error)
		}
	}

	async getCategoryFiles(req, res, next) {
		try {
			const { category } = req.params
			const files = await categoryService.getCategoryFiles(category)
			return res.json(files)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new CategoryController()
