import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StoreContext } from '../store/context'
import { DbFile } from '../utils/types'
import { DisplayFile } from './DisplayFile'

export const UserPage = observer(() => {
	const { userId } = useParams()
	const [files, setFiles] = useState<DbFile[]>([])
	const { feedResourceStore, userStore } = useContext(StoreContext)

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (userId) {
					const files = await feedResourceStore.fetchUserData({ userId })
					await userStore.getUserData(userId)
					setFiles(files || [])
				}
			} catch (error) {
				console.error('Error fetching user files:', error)
			}
		}

		fetchData()
	}, [userId, feedResourceStore, userStore])
	return (
		<div>
			<h2 className='bg-gray-400 flex justify-center items-center font-bold h-10'>
				User Profile: {userStore.userData?.username || 'Loading...'}
			</h2>
			<div className='p-0 mt-[5px] ml-[5px]'>
				<div className='flex flex-wrap gap-4'>
					{files.map(file => (
						<DisplayFile key={file.fileName} file={file} />
					))}
				</div>
			</div>
		</div>
	)
})
