const UserModel = require('../models/user-models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
	async signup(username, email, password) {
		const newUser = await UserModel.findOne({ email })
		if (newUser) {
			throw ApiError.BadRequest(
				`Пользователь с таким email: ${email} уже существует.`
			)
		}

		const newNameUser = await UserModel.findOne({ username })
		if (newNameUser) {
			throw ApiError.BadRequest(
				`Пользователь с таким username: ${username} уже существует.`
			)
		}

		const hashPassword = await bcrypt.hash(password, 3)
		const activationLink = uuid.v4()
		const user = await UserModel.create({
			username,
			email,
			password: hashPassword,
			activationLink,
		})

		await mailService.sendActivationMail(
			email,
			`${process.env.API_URL}/api/activate/${activationLink}`
		)

		const userDto = new UserDto(user) // id, email, isActivated
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async activate(activationLink) {
		const user = await UserModel.findOne({ activationLink })
		if (!user) {
			throw ApiError.BadRequest('Некорректная ссылка активации.')
		}

		user.isActivated = true
		await user.save()
	}

	async login(email, password) {
		const user = await UserModel.findOne({ email })
		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким email не найден.')
		}
		const isPassEqual = await bcrypt.compare(password, user.password)
		if (!isPassEqual) {
			throw ApiError.BadRequest('Неверный пароль. ')
		}
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}
		const user = await UserModel.findById(userData.id)
		const userDto = new UserDto(user)
		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return {
			...tokens,
			user: userDto,
		}
	}

	async getUsersData({ userId } = {}) {
		if (userId) {
			return await UserModel.findOne({ _id: userId }).select([
				'-password',
				'-isActivated',
				'-__v',
				'-activationLink',
			])
		}

		const users = await UserModel.find().select([
			'-password',
			'-isActivated',
			'-__v',
			'-activationLink',
		])
		return users
	}
}

module.exports = new UserService()
