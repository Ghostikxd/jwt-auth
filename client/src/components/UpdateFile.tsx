import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { DbFile } from '../utils/types'
import { DisplayFile } from './DisplayFile'
import { UpdateConfirmation } from './UpdateConfirmation'

interface UpdateFileProps {
	files: DbFile[]
	onCancel: () => void
	onConfirm: (selectedFile: DbFile) => void
}

export const UpdateFile = observer(
	({ files, onCancel, onConfirm }: UpdateFileProps) => {
		const [selectedFile, setSelectedFile] = useState<DbFile>(null!)
		const [isConfirmationOpen, setConfirmationOpen] = useState(false)
		const handleFileToggle = (file: DbFile) => {
			setSelectedFile(file)
		}

		const handleFileUpdate = () => {
			if (selectedFile) {
				// При нажатии "OK" открываем всплывающее окно
				setConfirmationOpen(true)
			}
		}

		const handleConfirmationClose = () => {
			// Обработчик закрытия всплывающего окна
			setConfirmationOpen(false)
			onCancel()
		}

		return (
			<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20 '>
				<div className='bg-gray-700 rounded-lg shadow-lg p-6 w-3/4 h-3/4 relative'>
					<FontAwesomeIcon
						icon={faTimes}
						className='absolute top-2 right-2 text-red-500 hover:bg-red-700 cursor-pointer'
						onClick={onCancel}
					/>
					<p className='text-center text-white font-bold '>
						Выберите файл, который хотите обновить:
					</p>
					<div className='flex flex-wrap justify-center overflow-auto h-5/6 mt-2 mb-10 '>
						{files.map(file => (
							<div key={file.fileName} className='m-2'>
								<label className='flex items-center space-x-2'>
									<input
										type='radio'
										className='form-radio scale-150'
										checked={selectedFile?.fileName === file.fileName}
										onChange={() => handleFileToggle(file)}
									/>
									<DisplayFile file={file} />
								</label>
							</div>
						))}
					</div>
					<div className='flex justify-center space-x-8 mt-auto mb-auto'>
						<button
							className='w-16 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded'
							onClick={handleFileUpdate}
						>
							OK
						</button>
					</div>
				</div>
				{isConfirmationOpen && (
					<UpdateConfirmation
						fileToEdit={selectedFile}
						onConfirm={handleFileUpdate}
						onCancel={handleConfirmationClose}
						closeModal={() => setConfirmationOpen(false)}
					/>
				)}
			</div>
		)
	}
)
