import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { Category, DbFile } from '../utils/types'
import { CATEGORY_URL } from '../utils/urls'

export class CategoryStore {
	files: DbFile[] = []
	categories: Category[] = []
	categoryData: Record<string, string> = {}
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

	async getCategories() {
		try {
			const response = await axios.get(CATEGORY_URL)
			return response.data
		} catch (error) {
			console.error('Error getting categories:', error)
			throw error
		}
	}

	async getCategoryData(categoryIds: string[]) {
		this.setLoading(true)
		try {
			const promises = categoryIds.map(async categoryId => {
				const response = await fetch(`${CATEGORY_URL}?categoryId=${categoryId}`)
				const categoryData: Category[] = await response.json()
				const category = categoryData.find(cat => cat._id === categoryId)
				return category ? { id: categoryId, name: category.name } : null
			})

			const categories = await Promise.all(promises)
			categories.forEach(category => {
				if (category) {
					this.categoryData[category.id] = category.name
				}
			})

			return categories
		} catch (error) {
			console.error('Error fetching category Data: ', error)
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}

	async fetchCategoryFiles(category: string) {
		this.setLoading(true)
		try {
			const response = await axios.get(`${CATEGORY_URL}/${category}`)
			const categoryFiles: DbFile[] = response.data
			this.files = categoryFiles
			return categoryFiles
		} catch (error) {
			console.error('Error fetching category files:', error)
			throw error
		} finally {
			this.setLoading(false)
			this.setLoaded(true)
		}
	}
}
