import { makeAutoObservable } from 'mobx'
import $api from '../http'
import { Category, DbFile } from '../utils/types'
import {
	FILES_URL,
	getServerFileUrl,
	getServerMinioFileUrl,
} from '../utils/urls'

export class FeedResourceStore {
	files: DbFile[] = []
	file: DbFile | null = null
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

	async fetchFileData({ title, path }: { title: string; path?: string }) {
		this.setLoading(true)
		try {
			const response = await fetch(getServerFileUrl(title))
			const data = await response.json()
			this.file = data
			return data
		} catch (error) {
			console.error('Error fetching file:', error)
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}

	async fetchUserData({ userId, path }: { userId: string; path?: string }) {
		this.setLoading(true)
		try {
			const response = await fetch(`${FILES_URL}?userId=${userId}`)
			const userFiles: DbFile[] = await response.json()
			this.files = userFiles
			return userFiles
		} catch (error) {
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}

	async updateFile(
		title: string,
		newCategories: Category[],
		newTitle: string | null,
		newDescription: string | null
	) {
		try {
			const response = await $api.post('/files/update-file', {
				title,
				newCategories,
				newTitle,
				newDescription,
			})

			if (!response.data.success) {
				console.error('Failed to update file:', response.data.message)
			}
		} catch (error: any) {
			console.error('Error updating file:', error.message)
		}
	}

	async uploadFile(formData: FormData) {
		try {
			const response = await $api.post('/files/create-file', formData)

			if (!response.data.success) {
				throw new Error('Failed to upload file:', response.data.message)
			}
		} catch (error: any) {
			console.error('Error uploading file:', error.message)
		}
	}

	async deleteFiles(selectedFiles: DbFile[]) {
		try {
			const fileNames = selectedFiles.map(file => file.title)

			const response = await $api.post('/files/delete-files', { fileNames })

			if (!response.data.success) {
				console.error('Failed to delete files:', response.data.message)
			}
		} catch (error: any) {
			console.error('Error deleting files:', error.message)
		}
	}

	getFileMinio(fileName: string) {
		return getServerMinioFileUrl(fileName)
	}

	getFileDb(title: string) {
		return getServerFileUrl(title)
	}
}
