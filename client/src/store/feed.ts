import { makeAutoObservable } from 'mobx'
import { DbFile } from '../utils/types'
import { getServerFileUrl, getServerMinioFileUrl } from '../utils/urls'

export class FeedStore {
	files: DbFile[] = []
	isLoading: boolean = false
	isLoaded: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	setLoading(bool: boolean) {
		this.isLoading = bool
	}

	setLoaded(bool: boolean) {
		this.isLoaded = bool
	}

	async fetchData(path?: string) {
		this.setLoading(true)
		try {
			const response = await fetch(getServerFileUrl(path))
			const data = await response.json()
			this.files = data
		} catch (error) {
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}

	getFileMinio(fileName: string) {
		return getServerMinioFileUrl(fileName)
	}

	getFileDb(title: string) {
		return getServerFileUrl(title)
	}
}
