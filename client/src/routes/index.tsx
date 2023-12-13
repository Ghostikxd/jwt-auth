import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { DisplayFile } from '../components/DisplayFile'
import { StoreContext } from '../store/context'

export const IndexRoute = observer(() => {
	const { feedStore } = useContext(StoreContext)

	useEffect(() => {
		feedStore.fetchData()
	}, [])

	if (feedStore.files.length === 0) {
		return <p>No files</p>
	}

	return (
		<div className='p-0 mt-[5px] ml-[5px]'>
			<div className='flex flex-wrap gap-4'>
				{feedStore.files.map(file => (
					<DisplayFile key={file.fileName} file={file} />
				))}
			</div>
		</div>
	)
})
