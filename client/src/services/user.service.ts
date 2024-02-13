import axios from 'axios'
import { IUserTokenResponse, IUserWithTokens } from '../types/user.interface'

class UserService {
	private URL = `${import.meta.env.VITE_API_URL}/user`

	async registration(login: string, password: string, name: string) {
		return await axios.post<any, IUserTokenResponse>(
			`${this.URL}/registration`,
			{
				login,
				password,
				name,
			},
			{
				withCredentials: true,
			}
		)
	}

	async login(login: string, password: string) {
		return await axios.post<any, IUserTokenResponse>(
			`${this.URL}/login`,
			{
				login,
				password,
			},
			{
				withCredentials: true,
			}
		)
	}

	async logout() {
		return await axios.post(
			`${this.URL}/logout`,
			{},
			{
				withCredentials: true,
			}
		)
	}

	async refresh() {
		return await axios.get<IUserWithTokens>(`${this.URL}/refresh`, {
			withCredentials: true,
		})
	}
}

export default new UserService()
