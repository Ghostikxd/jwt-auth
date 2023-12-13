import { AxiosResponse } from 'axios'
import $api from '../http'
import { AuthResponse } from '../models/response/AuthResponse'
import { IUser } from '../models/response/IUser'

export default class AuthService {
	static async login(
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/login', { email, password })
	}

	static async signup(
		username: string,
		email: string,
		password: string
	): Promise<AxiosResponse<AuthResponse>> {
		return $api.post<AuthResponse>('/signup', { username, email, password })
	}

	static async logout(): Promise<void> {
		return $api.post('/logout')
	}

	static async getUserByToken(token: string): Promise<AxiosResponse<IUser>> {
		return $api.get<IUser>('/account', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	}
}
