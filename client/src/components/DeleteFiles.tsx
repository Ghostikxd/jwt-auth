import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { StoreContext } from '../store/context'
import { DbFile } from '../utils/types'
import { DeleteConfirmation } from './DeleteConfirmation'
import { DisplayFile } from './DisplayFile'

interface DeleteFilesProps {
	files: DbFile[]
	onCancel: () => void
	onConfirm: () => void
}

export const DeleteFiles = observer(({ files, onCancel }: DeleteFilesProps) => {
	const { feedResourceStore, feedStore, accountStore } =
		useContext(StoreContext)
	const [selectedFiles, setSelectedFiles] = useState<DbFile[]>([])
	const [isConfirmationInfoOpen, setConfirmationInfoOpen] = useState(false)

	const openConfirmationInfo = () => {
		setConfirmationInfoOpen(true)
	}

	const closeConfirmationInfo = () => {
		setConfirmationInfoOpen(false)
	}

	const handleFileToggle = (file: DbFile) => {
		const isSelected = selectedFiles.some(
			selectedFile => selectedFile.fileName === file.fileName
		)

		if (isSelected) {
			setSelectedFiles(prevSelectedFiles =>
				prevSelectedFiles.filter(
					selectedFile => selectedFile.fileName !== file.fileName
				)
			)
		} else {
			setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, file])
		}
	}

	const handleFileDelete = async () => {
		try {
			await feedResourceStore.deleteFiles(selectedFiles)
			await feedResourceStore.fetchUserData({ userId: accountStore.data?.id! })
			await feedStore.fetchData()
			closeConfirmationInfo()
			onCancel()
		} catch (error: any) {
			console.error('Ошибка при удалении файлов:', error.message)
		}
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
					Выберите файлы, которые хотите удалить:
				</p>
				<div className='flex flex-wrap justify-center overflow-auto h-5/6 mt-2 mb-10 '>
					{files.map(file => (
						<div key={file.fileName} className='m-2'>
							<label className='flex items-center space-x-2'>
								<input
									type='checkbox'
									className='form-checkbox scale-150'
									checked={selectedFiles
										.map(selectedFile => selectedFile.fileName)
										.includes(file.fileName)}
									onChange={() => handleFileToggle(file)}
								/>
								<DisplayFile file={file} />
							</label>
						</div>
					))}
				</div>
				<div className='flex justify-center space-x-8 mt-auto mb-auto'>
					<button
						className=' w-16 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded'
						onClick={openConfirmationInfo}
					>
						OK
					</button>
				</div>
				{isConfirmationInfoOpen && (
					<DeleteConfirmation
						files={files}
						selectedFiles={selectedFiles}
						onConfirm={handleFileDelete}
						onCancel={closeConfirmationInfo}
					/>
				)}
			</div>
		</div>
	)
})
