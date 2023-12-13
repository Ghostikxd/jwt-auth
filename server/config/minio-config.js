const Minio = require('minio')

const minioClient = new Minio.Client({
	endPoint: '0.0.0.0',
	port: 32030,
	accessKey: 'sanekD0omfist',
	secretKey: 'eg0rhanZo',
	useSSL: false,
})

module.exports = minioClient
