const { Schema, model } = require('mongoose')

const FileSchema = new Schema({
	categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	title: { type: String, required: true },
	description: { type: String },
	fileName: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
})

const File = model('File', FileSchema)

module.exports = File
