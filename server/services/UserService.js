const bcrypt = require('bcrypt')
const UserDto = require('../dtos/UserDto')
const { PrismaClient } = require('@prisma/client')
const tokenService = require('./TokenService')
const ApiError = require('../exceptions/ApiError')

const prisma = new PrismaClient()

class UserService {
	async registration(login, password, name) {
		const candidate = await prisma.user.findFirst({
			where: {
				login,
			},
		})

		if (candidate) {
			throw ApiError.BadRequest(
				`Пользователь с логином ${login} уже существует.`
			)
		}

		const hashPassword = bcrypt.hashSync(password, 3)
		const user = await prisma.user.create({
			data: {
				login,
				name,
				password: hashPassword,
			},
		})
		const userDto = new UserDto({ ...user, role: 'user' })

		const tokens = tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async login(login, password) {
		if (!login || !password) {
			throw ApiError.BadRequest('Логин и пароль должны быть указаны.')
		}

		const user = await prisma.user.findFirst({
			where: {
				login,
			},
			include: {
				role: true,
			},
		})
		if (!user) {
			throw ApiError.BadRequest(
				`Пользователя с логином ${login} не существует.`
			)
		}

		const isPassEqual = await bcrypt.compare(password, user.password)
		if (!isPassEqual) {
			throw ApiError.BadRequest('Неверный пароль')
		}

		const userDto = new UserDto({ ...user, role: user.role.role_name })
		const tokens = await tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}

	async logout(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}

		const token = await tokenService.removeToken(refreshToken)
		return token
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw ApiError.UnauthorizedError()
		}

		const userData = tokenService.validateToken(
			refreshToken,
			process.env.JWT_REFRESH_SECRET
		)
		const tokenFromDb = await tokenService.findToken(refreshToken)
		if (!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError()
		}

		const user = await prisma.user.findUnique({
			where: {
				id: userData.id,
			},
			include: {
				role: true,
			},
		})
		const userDto = new UserDto({ ...user, role: user.role.role_name })
		const tokens = await tokenService.generateTokens({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { ...tokens, user: userDto }
	}
}

module.exports = new UserService()
