import { observer } from 'mobx-react-lite'
import { Fragment, useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import { StoreContext, stores } from '../store/context'

export const AppLayout = () => {
	return (
		<StoreContext.Provider value={stores}>
			<App />
		</StoreContext.Provider>
	)
}

const App = observer(() => {
	const { accountStore } = useContext(StoreContext)

	useEffect(() => {
		accountStore.fetchData()
	}, [])

	return (
		<Fragment>
			<Header />
			<main className='mb-16'>
				<Outlet />
			</main>
			<footer className='bg-gray-900 font-bold text-white p-4 flex justify-center items-center fixed bottom-0 w-full'>
				My First Full-Stack Project
			</footer>
		</Fragment>
	)
})

const Header = observer(() => {
	const { accountStore } = useContext(StoreContext)

	const authorized = !!accountStore.data && !!localStorage.getItem('token')
	if (!accountStore.isLoaded) {
		return <header className='h-[90px] bg-gray-900 w-[100%]'></header>
	}
	return (
		<header>
			<Navigation loggedIn={authorized} />
		</header>
	)
})
