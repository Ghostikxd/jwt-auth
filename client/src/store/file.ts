import { makeAutoObservable } from 'mobx'
import { getServerFileUrl } from '../utils/urls'

export class FileStore {
	files: File[] = []
	isLoading: boolean = false
	isLoaded: boolean = false
	constructor() {
		makeAutoObservable(this)
	}

	addFile(file: File) {
		this.files.push(file)
	}

	clearFiles() {
		this.files = []
	}

	setLoading(bool: boolean) {
		this.isLoading = bool
	}

	setLoaded(bool: boolean) {
		this.isLoaded = bool
	}

	async fetchData(path: string) {
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
}
