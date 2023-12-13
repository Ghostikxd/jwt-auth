import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { DbFile } from '../utils/types'
import { DeleteFiles } from './DeleteFiles'
import { DisplayFile } from './DisplayFile'
import { UpdateFile } from './UpdateFile'
import { UploadFile } from './UploadFile'
interface ProfileProps {
	loggedIn: boolean
	user: any
	files: DbFile[]
}

export const Profile = observer(({ loggedIn, user, files }: ProfileProps) => {
	const [isAddFileModalOpen, setAddFileModalOpen] = useState(false)
	const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
	const [isEditFileModalOpen, setEditFileModalOpen] = useState(false)

	const openAddFileModal = () => {
		setAddFileModalOpen(true)
	}

	const closeAddFileModal = () => {
		setAddFileModalOpen(false)
	}

	const openDeleteConfirmation = () => {
		setDeleteConfirmationOpen(true)
	}

	const closeDeleteConfirmation = () => {
		setDeleteConfirmationOpen(false)
	}

	const handleFileDelete = () => {
		closeDeleteConfirmation()
	}

	const openEditFileModal = () => {
		setEditFileModalOpen(true)
	}

	const closeEditFileModal = () => {
		setEditFileModalOpen(false)
	}

	const handleFileUpdate = () => {
		closeEditFileModal()
	}

	if (!loggedIn || !user) {
		return (
			<div className=' mt-10 px-5 mx-auto text-center'>
				<p className='font-bold text-red-500'>
					Access denied. Please login or sign up.
				</p>
			</div>
		)
	}

	return (
		<div className='mt-3 px-5 mx-auto'>
			<div className='bg-gray-300 font-bold h-30 flex flex-col rounded-lg ml-2 p-2'>
				<p className='m-0'>User name: {user.username}</p>
				<p className='m-0'>
					Email: {user.email}{' '}
					<button
						onClick={openAddFileModal}
						className='bg-gray-400 font-bold h-30 flex flex-col rounded-lg ml-2 p-2'
					>
						Add File
					</button>
					<button
						onClick={openDeleteConfirmation}
						className='bg-gray-400 font-bold h-30 flex flex-col rounded-lg ml-2 p-2'
					>
						Delete Files
					</button>
					<button
						onClick={openEditFileModal}
						className='bg-gray-400 font-bold h-30 flex flex-col rounded-lg ml-2 p-2'
					>
						Edit
					</button>
				</p>
				<p className='m-0'>Activated: {user.isActivated ? 'Yes' : 'No'}</p>
			</div>

			<h1 className='mt-2 bg-gray-300 font-bold h-30 flex flex-col rounded-lg ml-2 p-2'>
				Your files:
			</h1>
			<div className='p-0 mt-[5px] ml-[5px]'>
				<div className='flex flex-wrap gap-4'>
					{files.map(file => (
						<DisplayFile key={file.fileName} file={file} />
					))}
				</div>
			</div>
			{isEditFileModalOpen && (
				<UpdateFile
					files={files}
					onConfirm={handleFileUpdate}
					onCancel={closeEditFileModal}
				/>
			)}
			{isDeleteConfirmationOpen && (
				<DeleteFiles
					files={files}
					onConfirm={handleFileDelete}
					onCancel={closeDeleteConfirmation}
				/>
			)}
			{isAddFileModalOpen && <UploadFile closeModal={closeAddFileModal} />}
		</div>
	)
})
