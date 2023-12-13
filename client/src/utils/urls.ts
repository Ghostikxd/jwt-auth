export function getServerMinioFileUrl(path?: string | null) {
	const basePath = 'http://localhost:32030/photos/'
	if (path) {
		return basePath + path
	}
	return basePath
}

export function getServerFileUrl(path?: string | null) {
	const basePath = 'http://localhost:1111/api/files/'
	if (path) {
		return basePath + path
	}
	return basePath
}

export const FILES_URL = 'http://localhost:1111/api/files'

export const CATEGORY_URL = 'http://localhost:1111/api/categories'

export const USERS_URL = 'http://localhost:1111/api/users'
