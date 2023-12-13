import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StoreContext } from '../store/context'
import { DbFile } from '../utils/types'
import { DisplayFile } from './DisplayFile'

export const CategoryPage = observer(() => {
	const { category } = useParams()
	const [files, setFiles] = useState<DbFile[]>([])
	const { categoryStore } = useContext(StoreContext)

	useEffect(() => {
		const fetchCategoryFiles = async () => {
			try {
				const files = await categoryStore.fetchCategoryFiles(category!)
				setFiles(files)
			} catch (error) {
				console.error('Error fetching category files:', error)
			}
		}

		fetchCategoryFiles()
	}, [category, categoryStore])

	return (
		<div>
			<h2 className='bg-gray-400 flex justify-center items-center font-bold h-10'>
				Category: {category}
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
