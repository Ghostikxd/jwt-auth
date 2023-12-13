const Router = require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')
const fileController = require('../controllers/file-controller')
const categoryController = require('../controllers/category-controller')

router.post(
	'/signup',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 24 }),
	userController.signup
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post(
	'/categories/create-category',
	authMiddleware,
	categoryController.create
)
router.post('/files/create-file', authMiddleware, fileController.create)
router.post('/files/delete-files', authMiddleware, fileController.deleteFiles)
router.post(
	'/files/update-file/:title',
	authMiddleware,
	fileController.updateFile
)

router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)
router.get('/account', authMiddleware, userController.getAccount)
router.get('/categories', categoryController.getCategories)
router.get('/categories/:category', categoryController.getCategoryFiles)
router.get('/files', fileController.getFilesDb)
router.get('/files/:title', fileController.getFileByTitle)
/* router.get('/files-minio', fileController.listFilesMinio)  */
/* router.get('/uploads/:title', fileController.getUpload) */ //подумать
/* router.get('/files-test/:title', fileController.getFileByTitleTest) */

module.exports = router
