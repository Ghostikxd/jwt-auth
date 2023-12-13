import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { API_URL } from '../http'
import { AuthResponse } from '../models/response/AuthResponse'
import { IUser } from '../models/response/IUser'
import AuthService from '../services/AuthService'


/* export class MainStore{

	constructor(){
		this.accountStore  = new AccountStore()
	}

} */


/* export default class Store {
	user = {} as IUser
	isAuth = false
	isLoading = false
	constructor() {
		makeAutoObservable(this)
	}

	setAuth(bool: boolean) {
		this.isAuth = bool
	}

	setUser(user: IUser) {
		this.user = user
	}

	setLoading(bool: boolean) {
		this.isLoading = bool
	}

	async login(email: string, password: string) {
		try {
			const response = await AuthService.login(email, password)
			//console.log(response)
			localStorage.setItem('token', response.data.accessToken)
			this.setAuth(true)
			this.setUser(response.data.user)
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
			this.setAuth(true)
			this.setUser(response.data.user)
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
			this.setAuth(false)
			this.setUser({} as IUser)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		}
	}

	async checkAuth() {
		this.setLoading(true)
		try {
			const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
				withCredentials: true,
			})
			//console.log(response)
			localStorage.setItem('token', response.data.accessToken)
			this.setAuth(true)
			this.setUser(response.data.user)
		} catch (error: any) {
			console.log(error.response?.data?.message)
		} finally {
			this.setLoading(false)
		}
	}
} */
