const ApiError = require('../exceptions/api-error')
const categoryModel = require('../models/category-model')
const fileModel = require('../models/file-model')

class CategoryService {
	async create(name) {
		const newCategory = await categoryModel.findOne({ name })
		if (newCategory) {
			throw new Error('Данная категория уже существует! ')
		}

		const category = await categoryModel.create({
			name,
		})

		return category
	}

	async getCategories({ categoryId } = {}) {
		if (categoryId) {
			return await categoryModel.find({ _id: categoryId }).select(['-__v'])
		}
		const categories = await categoryModel.find().select(['-__v'])
		return categories
	}

	async getCategoryFiles(categoryName) {
		try {
			const category = await categoryModel.findOne({ name: categoryName })
			if (!category) {
				throw ApiError.BadRequest('Категория не найдена')
			}

			const files = await fileModel.find({ categories: category._id })

			if (!files || files.length === 0) {
				throw ApiError.BadRequest('Файлы не найдены')
			}

			return files.map(file => file.toObject())
		} catch (error) {
			throw error
		}
	}
}

module.exports = new CategoryService()
