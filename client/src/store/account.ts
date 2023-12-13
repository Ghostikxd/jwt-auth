import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { API_URL } from '../http'
import { AuthResponse } from '../models/response/AuthResponse'
import { IUser } from '../models/response/IUser'
import AuthService from '../services/AuthService'

export class AccountStore {
	data: IUser | null = null
	isLoading: boolean = false
	isLoaded: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	setData(data: IUser) {
		this.data = data
	}

	setLoading(bool: boolean) {
		this.isLoading = bool
	}

	setLoaded(bool: boolean) {
		this.isLoaded = bool
	}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password)
			//console.log(response)
			localStorage.setItem('token', response.data.accessToken)
			this.setData(response.data.user)
			return true
		} catch (error: any) {
			console.log(error.response?.data?.message)
			return false
		}
	}

	async signup(username: string, email: string, password: string) {
		try {
			const response = await AuthService.signup(username, email, password)
			//console.log(response)
			localStorage.setItem('token', response.data.accessToken)
			this.setData(response.data.user)
			return true
		} catch (error: any) {
			console.log(error.response?.data?.message)
			return false
		}
	}

	async logout() {
		try {
			const response = await AuthService.logout()
			//console.log(response)
			localStorage.removeItem('token')
			this.setData({} as IUser)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		}
	}

	async fetchData() {
		this.setLoading(true)
		try {
			const token = localStorage.getItem('token')
			if (token) {
				const response = await AuthService.getUserByToken(token)
				const userData = response.data
				this.setData(userData)
			} else {
				console.log('Токен отсутствует')
				this.logout()
			}
		} catch (error: any) {
			if (error.response?.status === 401) {
				const refreshed = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
					withCredentials: true,
				})

				localStorage.setItem('token', refreshed.data.accessToken)
				this.setData(refreshed.data.user)
				if (refreshed) {
					const newToken = localStorage.getItem('token')
					if (newToken) {
						const response = await AuthService.getUserByToken(newToken)
						this.setData(response.data)
					} else {
						console.log('Токен отсутствует после обновления')
						this.logout()
					}
				} else {
					console.log('Не удалось обновить токен')
					this.logout()
				}
			} else {
				console.log(error.response?.data?.message)
				this.logout()
			}
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}
}
