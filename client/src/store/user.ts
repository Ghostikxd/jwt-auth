import { makeAutoObservable } from 'mobx'
import { IUser } from '../models/response/IUser'
import { USERS_URL } from '../utils/urls'

export class UserStore {
	userData: IUser | null = null
	isLoading: boolean = false
	isLoaded: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	setData(userData: IUser) {
		this.userData = userData
	}

	setLoading(bool: boolean) {
		this.isLoading = bool
	}

	setLoaded(bool: boolean) {
		this.isLoaded = bool
	}

	async getUserData(userId: string) {
		this.setLoading(true)
		try {
			const response = await fetch(`${USERS_URL}?userId=${userId}`)
			const user: IUser = await response.json()
			this.userData = user
			return user
		} catch (error) {
			console.error('Error fetching user Data: ', error)
			throw error
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}
}
