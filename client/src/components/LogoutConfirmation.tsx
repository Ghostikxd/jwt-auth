import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface LogoutConfirmationProps {
	onConfirm: () => void
	onCancel: () => void
}

export const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
	onConfirm,
	onCancel,
}) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20'>
			<div className='bg-gray-700 rounded-lg shadow-lg p-6 w-100 relative '>
				<FontAwesomeIcon
					icon={faTimes}
					className='absolute top-2 right-2 text-red-500 hover:bg-red-700 cursor-pointer'
					onClick={onCancel}
				/>
				<p className='text-center'>Вы уверены, что хотите выйти из аккаунта?</p>
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
