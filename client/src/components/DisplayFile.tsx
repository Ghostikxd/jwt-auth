import { useContext, useState } from 'react'

import { observer } from 'mobx-react-lite'
import { StoreContext } from '../store/context'
import { DbFile } from '../utils/types'

interface DisplayFileProps {
	file: DbFile
}

export const DisplayFile = observer(({ file }: DisplayFileProps) => {
	const [isDescriptionVisible, setDescriptionVisible] = useState(false)
	const { feedStore } = useContext(StoreContext)

	return (
		<div className='border rounded px-4 mt-0 flex flex-col justify-center items-center relative bg-gray-300'>
			<h2 className='font-bold text-lg flex justify-center'>
				{(file as DbFile).title}
			</h2>

			<div className='relative'>
				<img
					src={feedStore.getFileMinio(file.fileName)}
					alt={feedStore.getFileDb(file.title)}
					className='cursor-pointer block max-h-[300px] max-w-[800px] aspect-auto'
					onMouseEnter={() => setDescriptionVisible(true)}
					onMouseLeave={() => setDescriptionVisible(false)}
				/>
				{isDescriptionVisible && (
					<div className='bg-black bg-opacity-70 text-white p-2 absolute bottom-0 left-0 right-0'>
						{(file as DbFile).description}
					</div>
				)}
			</div>

			<a
				href={`/photo/${(file as DbFile).title}`}
				className='underline hover:text-blue-500'
			>
				Go to photo
			</a>
		</div>
	)
})
