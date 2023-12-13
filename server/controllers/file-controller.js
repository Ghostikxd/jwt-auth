const minioClient = require('../config/minio-config')
const fileService = require('../service/file-service')
const { validationResult } = require('express-validator')
const MINIO_URL = process.env.MINIO_URL

class FileController {
	async create(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
			}
			const { user } = req
			const userId = user.id
			const { categories, title, description } = req.body
			const { fileData } = req.files
			const fileCreate = await fileService.create(
				categories,
				title,
				description,
				fileData,
				userId
			)
			return res.json(fileCreate)
		} catch (error) {
			next(error)
		}
	}

	//продумать обновления файла по какому параметру обращаться, возможно сделать 2 функции обновления в виде обновления файла/картинки и обновления остальной инфы в ключе этой функции.
	async updateFile(req, res, next) {
		try {
			const { title } = req.params
			const { newCategories, newTitle, newDescription } = req.body

			const updatedFile = await fileService.updateFile(
				title,
				newCategories,
				newTitle,
				newDescription
			)

			return res.json(updatedFile)
		} catch (error) {
			next(error)
		}
	}

	async deleteFiles(req, res, next) {
		try {
			const { fileNames } = req.body

			await fileService.deleteFiles(fileNames)

			return res.json({ message: 'Файлы успешно удалены' })
		} catch (error) {
			next(error)
		}
	}

	async getFileByTitle(req, res, next) {
		try {
			const { title } = req.params
			const file = await fileService.getFileBy(title)
			return res.json(file)
		} catch (error) {
			next(error)
		}
	}

	async getFilesDb(req, res, next) {
		try {
			const userId = req.query.userId
			const files = await fileService.getFilesDb({ userId })

			return res.json(files)
		} catch (error) {
			next(error)
		}
	}
	/* async listFilesMinio(req, res, next) {
		try {
			const listFiles = await fileService.listAllFilesMinio()
			return res.json(listFiles)
		} catch (error) {
			next(error)
		}
	} */
	/* async getCombinedFiles(req, res, next) {
		try {
			const combinedFiles = await fileService.getCombinedFiles()

			return res.json(combinedFiles)
		} catch (error) {
			next(error)
		}
	} */

	/* async getCombinedFileByTitle(req, res, next) {
		try {
			const title = req.params.title
			const combinedFile = await fileService.getCombinedFileByTitle(title)

			return res.json(combinedFile)
		} catch (error) {
			next(error)
		}
	} */

	/* async getFileByTitleTest(req, res, next) {
		try {
			const title = req.params.title
			const file = await fileService.getFileBy(title)
			const fileInfo = await fileService.getFileInfo(file.fileName)

			if (!fileInfo) {
				return res.status(404).json({ error: 'Файл не найден' })
			}

			return res.json(fileInfo)
		} catch (error) {
			next(error)
		}
	}
 */
	/* async getUpload(req, res, next) {
		try {
			const title = req.params.title
			const file = await fileService.getFileBy(title)

			if (!file) {
				return res.status(404).json({ error: 'Файл не найден' })
			}

			const minioURL = new URL(`/photos/${file.fileName}`, MINIO_URL).toString()
			const minioResponse = await fetch(minioURL)

			if (!minioResponse.ok) {
				return res
					.status(minioResponse.status)
					.json({ error: 'Ошибка при получении файла с MinIO' })
			}

			
			res.setHeader(
				'Content-Disposition',
				`attachment; filename="${file.fileName}"`
			)
			res.setHeader('Content-Type', 'application/octet-stream')

			
			minioResponse.body.pipe(res)
		} catch (error) {
			next(error)
		}
	} */
}

module.exports = new FileController()
