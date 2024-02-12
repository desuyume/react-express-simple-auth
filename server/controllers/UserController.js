const { cookieConfig } = require('../config/cookie.config')
const ApiError = require('../exceptions/ApiError')
const userService = require('../services/UserService')
const { validationResult } = require('express-validator')

class UserController {
	async registration(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
			}

			const { login, password, name } = req.body

			const userData = await userService.registration(login, password, name)
			res.cookie('refreshToken', userData.refreshToken, cookieConfig)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async login(req, res, next) {
		try {
			const { login, password } = req.body
			const userData = await userService.login(login, password)
			res.cookie('refreshToken', userData.refreshToken, cookieConfig)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		} catch (e) {
			console.log(e);
			next(e)
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			console.log(req.cookies);
			console.log(refreshToken);
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, cookieConfig)
			return res.json(userData)
		} catch (e) {
			next(e)
		}
	}
}

module.exports = new UserController()
