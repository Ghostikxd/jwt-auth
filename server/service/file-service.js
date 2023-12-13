const minioClient = require('../config/minio-config')
const fileModel = require('../models/file-model')
const ApiError = require('../exceptions/api-error')
const uuid = require('uuid')
const userModels = require('../models/user-models')
const categoryModel = require('../models/category-model')
const { Readable } = require('stream')
//class с upload(), delete(), update()

class FileService {
	async uploadFileMinio(fileData, newFileName) {
		return new Promise((resolve, reject) => {
			minioClient.putObject('photos', newFileName, fileData, (err, etag) => {
				if (err) {
					reject(err)
				} else {
					resolve(etag)
				}
			})
		})
	}

	async deleteFileMinio(fileName) {
		return new Promise((resolve, reject) => {
			minioClient.removeObject('photos', fileName, err => {
				if (err) {
					reject(err)
				} else {
					resolve('File removed from MinIO')
				}
			})
		})
	}

	async updateFileMinio(existingFileName, newFileData, newFileName) {
		await this.deleteFileMinio(existingFileName)

		await this.uploadFileMinio(newFileData, newFileName)
	}

	/* async getFileMinio(fileName) {
		return new Promise((resolve, reject) => {
			minioClient.getObject('photos', fileName, (err, dataStream) => {
				if (err) {
					reject(err)
				} else {
					let fileData = ''
					dataStream.on('data', chunk => {
						fileData += chunk
					})
					dataStream.on('end', () => {
						resolve({
							data: fileData,
						})
					})
				}
			})
		})
	} */

	/* async listAllFilesMinio() {
		return new Promise((resolve, reject) => {
			const files = []

			const stream = minioClient.listObjectsV2('photos')
			stream.on('data', function (obj) {
				obj.source = 'minio'
				files.push(obj)
			})
			stream.on('error', function (err) {
				reject(err)
			})
			stream.on('end', function () {
				resolve(files)
			})
		})
	} */

	async create(categories, title, description, fileData, userId) {
		const newFile = await fileModel.findOne({ title })
		if (newFile) {
			throw ApiError.BadRequest(
				`Файл с таким названием: ${title} уже существует.`
			)
		}
		const originalFile = fileData
		const originalFileName = originalFile.name

		const uniqueIdentifier = uuid.v4()
		const parts = originalFileName.split('.')
		const fileNameWithoutExtension = parts[0]
		const fileExtension = parts[1]

		const newFileName = `${fileNameWithoutExtension}_${uniqueIdentifier}.${fileExtension}`

		const categoryArray = Array.isArray(categories)
			? categories
			: categories.split(',').map(category => category.trim())

		const uniqueCategories = [...new Set(categoryArray)]

		const categoryNames = await Promise.all(
			uniqueCategories.map(category =>
				categoryModel.findOne({ name: category })
			)
		)

		if (categoryNames.some(category => !category)) {
			throw ApiError.BadRequest('Одна или несколько категорий не существуют')
		}
		const user = await userModels.findById(userId)

		const fileCreate = fileModel.create({
			categories: categoryNames,
			title,
			description,
			fileName: newFileName,
			userId: user.id,
		})
		await this.uploadFileMinio(fileData.data, newFileName)
		return fileCreate
	}

	async updateFile(title, newCategories, newTitle, newDescription) {
		const file = await fileModel.findOne({ title })
		if (!file) {
			throw ApiError.BadRequest('Файл не найден')
		}

		if (newCategories) {
			const categoryArray = Array.isArray(newCategories)
				? newCategories
				: newCategories.split(',').map(category => category.trim())

			const uniqueCategories = [...new Set(categoryArray)]
			const updatedCategories = await Promise.all(
				uniqueCategories.map(category =>
					categoryModel.findOne({ name: category })
				)
			)
			file.categories = updatedCategories
		}
		if (newTitle) {
			file.title = newTitle
		}
		if (newDescription) {
			file.description = newDescription
		}

		await file.save()
		return file
	}

	async deleteFiles(fileNames) {
		try {
			for (const fileName of fileNames) {
				await this.deleteFile(fileName)
			}
		} catch (error) {
			throw error
		}
	}

	async deleteFile(title) {
		const file = await fileModel.findOne({ title })
		if (!file) {
			throw ApiError.BadRequest('Файл не найден')
		}
		await file.deleteOne()
		await this.deleteFileMinio(file.fileName)
	}

	async getFileBy(title) {
		const file = await fileModel.findOne({ title })
		if (!file) {
			throw ApiError.BadRequest('Файл не найден')
		}
		return { ...file.toObject() }
	}

	async getFilesDb({ userId } = {}) {
		if (userId) {
			return await fileModel
				.find({ userId: userId })
				.select(['-__v'])
				.then(files => files.map(file => file.toObject()))
		}

		const files = await fileModel.find().select(['-__v'])

		return files.map(file => file.toObject())
	}

	/* async getCombinedFiles() {
		try {
			const minioFiles = await this.listAllFilesMinio()
			const dbFiles = await this.getAllFilesDb()

			const combinedFiles = [...minioFiles, ...dbFiles]

			return combinedFiles
		} catch (error) {
			throw ApiError.BadRequest('Произошла непредвиденная ошибка')
		}
	} */
	/* async getCombinedFileByTitle(title) {
		try {
			const dbFile = await this.getFileBy(title)
			if (!dbFile) {
				throw ApiError.BadRequest('Файл не найден')
			}
			const fileName = dbFile.fileName
			const minioFileData = await this.getFileMinio(fileName)

			return [dbFile, minioFileData]
		} catch (error) {
			throw ApiError.BadRequest('Произошла непредвиденная ошибка')
		}
	} */

	/* async getFileInfo(fileName) {
		return new Promise((resolve, reject) => {
			minioClient.statObject('photos', fileName, (err, stat) => {
				if (err) {
					reject(err)
				} else {
					const name = fileName
					const fileInfo = {
						name: name,
						size: stat.size,
						lastModified: stat.lastModified,
						etag: stat.etag,
					}
					resolve(fileInfo)
				}
			})
		})
	} */
}

module.exports = new FileService()
