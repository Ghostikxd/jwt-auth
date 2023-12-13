export interface MinioFile {
	name: string
	lastModified: string
	etag: string
	size: number
}

export interface DbFile {
	_id: string
	categories: string[] | string
	title: string
	description: string
	fileName: string
	userId: string
	__v: number
}

export interface Category {
	_id: string
	name: string
}
