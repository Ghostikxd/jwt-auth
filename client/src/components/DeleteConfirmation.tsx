import { observer } from 'mobx-react-lite'
import { DbFile } from '../utils/types'

interface DeleteConfirmationProps {
	files: DbFile[]
	selectedFiles: DbFile[]
	onConfirm: () => void
	onCancel: () => void
}

export const DeleteConfirmation = observer(
	({ files, selectedFiles, onConfirm, onCancel }: DeleteConfirmationProps) => {
		const selectedFileObjects = files.filter(file =>
			selectedFiles
				.map(selectedFile => selectedFile.fileName)
				.includes(file.fileName)
		)

		return (
			<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20'>
				<div className='bg-gray-700 rounded-lg shadow-lg p-6 w-2/4 h-1/4 relative'>
					<p className='text-center text-white font-bold '>
						Вы точно хотите удалить выбранные файлы?
					</p>
					<ul className='text-center text-white font-bold mt-6'>
						{selectedFileObjects.map((file, index) => (
							<li key={index}>{`${index + 1}. ${file.title}`}</li>
						))}
					</ul>
					<div className='flex justify-center mt-6 space-x-10'>
						<button
							className='w-16 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded'
							onClick={onConfirm}
						>
							Да
						</button>
						<button
							className=' w-16 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded'
							onClick={onCancel}
						>
							Нет
						</button>
					</div>
				</div>
			</div>
		)
	}
)
