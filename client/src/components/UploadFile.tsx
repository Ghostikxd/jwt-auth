import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../store/context'
import { Category } from '../utils/types'

//Написана лютая глина...
//При смене пользователя нужно обновлять стор иначе показываются файлы прошло пользователя.

interface UploadFile {
	closeModal: () => void
}

export const UploadFile = observer(({ closeModal }: UploadFile) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [category, setCategory] = useState('')
	const [categories, setCategories] = useState<Category[]>([])
	const [selectedCategories, setSelectedCategories] = useState<string[]>([])
	const { categoryStore, feedResourceStore, feedStore, accountStore } =
		useContext(StoreContext)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0])
		}
	}

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categories = await categoryStore.getCategories()
				setCategories(categories)
				setCategory(categories[0])
			} catch (error) {
				console.error('Error loading categories:', error)
			}
		}
		fetchCategories()
	}, [categoryStore])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!file) {
			console.error('Please select a file')
			return
		}
		const formData = new FormData()
		categories.forEach(category => {
			formData.append('categories', category.name)
		})
		formData.append('title', title)
		formData.append('description', description)
		formData.append('fileData', file)

		await feedResourceStore.uploadFile(formData)
		await feedResourceStore.fetchUserData({ userId: accountStore.data?.id! })
		await feedStore.fetchData()
		closeModal()
	}
	const handleCategoryChange = (category: Category) => {
		const isSelected = selectedCategories.includes(category._id)

		if (isSelected) {
			setSelectedCategories(prev => prev.filter(id => id !== category._id))
		} else {
			setSelectedCategories(prev => [...prev, category._id])
		}
	}
	return (
		<div className='modal fixed inset-0 flex items-center justify-center'>
			<div className='modal-overlay absolute w-full h-full bg-gray-900 opacity-50'></div>

			<div className='modal-container bg-gray-200 w-96 mx-auto rounded shadow-lg z-50 overflow-y-auto'>
				<div className='modal-content py-4 text-left px-6'>
					<FontAwesomeIcon
						icon={faTimes}
						className='text-red-500 hover:bg-red-700 cursor-pointer float-right'
						onClick={closeModal}
					/>
					<form onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='category'
							>
								Category
							</label>
							<div>
								{categories.map(category => (
									<div key={category._id} className='flex items-center mb-2'>
										<input
											type='checkbox'
											id={category._id}
											value={category._id}
											checked={selectedCategories.includes(category._id)}
											onChange={() => handleCategoryChange(category)}
											className='mr-2'
										/>
										<label htmlFor={category._id} className='text-gray-700'>
											{category.name}
										</label>
									</div>
								))}
							</div>
						</div>
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
								htmlFor='file'
							>
								File
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='file'
								type='file'
								onChange={handleFileChange}
							/>
						</div>

						<button
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
							type='submit'
						>
							Upload File
						</button>
					</form>
				</div>
			</div>
		</div>
	)
})
