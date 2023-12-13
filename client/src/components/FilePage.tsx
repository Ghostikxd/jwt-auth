import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { StoreContext } from '../store/context'
import { DbFile } from '../utils/types'
import { DownloadConfirmation } from './DownloadConfirmation'

export const FilePage = observer(() => {
	const { title } = useParams()
	const [file, setFile] = useState<DbFile | null>(null)
	const { feedResourceStore, userStore, categoryStore } =
		useContext(StoreContext)

	const [isDownloadConfirmationVisible, setDownloadConfirmationVisible] =
		useState(false)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fileData = await feedResourceStore.fetchFileData({
					title: title!,
				})
				setFile(fileData)

				if (fileData?.userId) {
					await userStore.getUserData(fileData.userId)
				}
				if (fileData?.categories) {
					await categoryStore.getCategoryData(fileData.categories as string[])
				}
			} catch (error) {
				console.error('Error fetching file:', error)
			}
		}

		fetchData()
	}, [title, feedResourceStore, userStore, categoryStore])

	const handleDownloadConfirmation = () => {
		setDownloadConfirmationVisible(true)
	}

	const handleDownloadConfirm = () => {
		setDownloadConfirmationVisible(false)
		if (file) {
			const downloadLink = document.createElement('a')
			downloadLink.href = feedResourceStore.getFileMinio(file.fileName)
			downloadLink.download = file.title
			document.body.appendChild(downloadLink)
			downloadLink.click()
			document.body.removeChild(downloadLink)
		}
	}

	const handleDownloadCancel = () => {
		setDownloadConfirmationVisible(false)
	}

	if (!file) {
		return <div>Loading...</div>
	}

	return (
		<div>
			<h2 className='bg-gray-300 flex justify-center items-center font-bold h-10'>
				File: {file.title}
			</h2>
			<div className='flex justify-center items-center '>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
					<div className='p-4 flex justify-center'>
						<img
							src={feedResourceStore.getFileMinio(file.fileName)}
							alt={feedResourceStore.getFileDb(file.title)}
							className='max-w-full h-auto'
						/>
					</div>
					<div>
						<h3 className='text-xl font-bold mt-4'>Title: {file.title}</h3>
						<p className='text-gray-600'>Description: {file.description}</p>
						<p className='text-gray-600'>
							Author:{' '}
							{userStore.userData ? (
								<Link
									to={`/profile/${file.userId}`}
									className='underline hover:text-blue-500'
								>
									{userStore.userData.username}
								</Link>
							) : (
								'Unknown'
							)}
						</p>
						<p className='text-gray-600'>
							Categories:{' '}
							{Array.isArray(file.categories)
								? (file.categories as string[])
										.map(categoryId => categoryStore.categoryData[categoryId])
										.filter(Boolean)
										.join(', ')
								: file.categories}
						</p>
						<a
							className='bg-blue-500 text-white px-4 py-2 rounded mt-4 inline-block'
							onClick={handleDownloadConfirmation}
						>
							Download
						</a>

						{isDownloadConfirmationVisible && (
							<DownloadConfirmation
								onConfirm={handleDownloadConfirm}
								onCancel={handleDownloadCancel}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
})
