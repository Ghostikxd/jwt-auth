import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../store/context'
import { Category, DbFile } from '../utils/types'

interface UpdateConfirmationProps {
	fileToEdit: DbFile
	onConfirm: () => void
	onCancel: () => void
	closeModal: () => void
}

export const UpdateConfirmation = observer(
	({
		fileToEdit,
		onConfirm,
		onCancel,
		closeModal,
	}: UpdateConfirmationProps) => {
		const { feedResourceStore, categoryStore } = useContext(StoreContext)
		const [title, setTitle] = useState(fileToEdit.title)
		const [description, setDescription] = useState(fileToEdit.description)
		const [categories, setCategories] = useState<Category[]>([])

		useEffect(() => {
			const fetchCategories = async () => {
				try {
					if (fileToEdit?.categories) {
						await categoryStore.getCategoryData(
							fileToEdit.categories as string[]
						)
					}
				} catch (error) {
					console.error('Error loading categories:', error)
				}
			}

			fetchCategories()
		}, [])

		const handleUpdate = async () => {
			try {
				await feedResourceStore.updateFile(
					title,
					categories,
					title,
					description
				)
				closeModal()
			} catch (error: any) {
				console.error('Error updating file:', error.message)
			}
		}

		return (
			<div className='modal fixed inset-0 flex items-center justify-center'>
				<div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>

				<div className='modal-container bg-gray-200 w-full mx-auto flex rounded shadow-lg z-50 max-w-screen-md'>
					<div className='w-1/2 p-6'>
						<h2 className='font-bold text-lg mb-4'>{fileToEdit.title}</h2>
						<img
							src={feedResourceStore.getFileMinio(fileToEdit.fileName)}
							alt={fileToEdit.title}
							className='w-full h-auto object-contain'
						/>
					</div>
					<div className='flex-1 p-6'>
						<FontAwesomeIcon
							icon={faTimes}
							className='text-red-500 hover:bg-red-700 cursor-pointer float-right'
							onClick={closeModal}
						/>
						<form>
							<div className='mb-4'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='title'
								>
									Title
								</label>
								<input
									className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									id='title'
									type='text'
									placeholder='Enter title'
									value={title}
									onChange={e => setTitle(e.target.value)}
								/>
							</div>

							<div className='mb-4'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='description'
								>
									Description
								</label>
								<textarea
									className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									id='description'
									placeholder='Enter description'
									value={description}
									onChange={e => setDescription(e.target.value)}
								></textarea>
							</div>

							<div className='mb-4'>
								<label
									className='block text-gray-700 text-sm font-bold mb-2'
									htmlFor='categories'
								>
									Categories
								</label>
							</div>

							<button
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
								type='button'
								onClick={handleUpdate}
							>
								Update File
							</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
)
