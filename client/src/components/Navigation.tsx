import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StoreContext } from '../store/context'
import { Category } from '../utils/types'
import { LogoutConfirmation } from './LogoutConfirmation'

interface NavigationProps {
	loggedIn: boolean
}

export const Navigation = observer(({ loggedIn }: NavigationProps) => {
	const { accountStore, categoryStore } = useContext(StoreContext)
	const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
	const navigate = useNavigate()

	const handleLogoutClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault()
		setShowLogoutConfirmation(true)
	}

	const confirmLogout = () => {
		accountStore.logout()
		navigate('/')
		setShowLogoutConfirmation(false)
	}

	const cancelLogout = () => {
		setShowLogoutConfirmation(false)
	}

	const menus = [{ name: 'Main', href: '/' }]
	const loggedInMenus = [
		{ name: 'Profile', href: '/auth/profile' },
		{ name: 'Logout' },
	]

	const nonLoggedInMenus = [
		{ name: 'Login', href: '/auth/login' },
		{ name: 'Sign Up', href: '/auth/signup' },
	]

	const [categories, setCategories] = useState<Category[]>([])
	//const [isDescriptionVisible, setDescriptionVisible] = useState(false)
	const [isCategoryVisible, setCategoryVisible] = useState(false)
	//const [isAuthDropdownVisible, setAuthDropdownVisible] = useState(false)

	const toggleCategory = () => {
		setCategoryVisible(!isCategoryVisible)
	}
	useEffect(() => {
		categoryStore
			.getCategories()
			.then(resp => (Array.isArray(resp) ? resp : []))
			.then(setCategories)
	}, [])
	return (
		<nav className='bg-gray-900 h-[90px] text-white p-4 flex justify-between items-center relative z-10'>
			<div>
				<a
					href='/'
					className='text-lg font-bold inline-block ml-4 transition transform hover:scale-110 hover:text-red-500'
				>
					Main
				</a>
			</div>
			<div className='relative inline-block group '>
				<button
					onClick={toggleCategory}
					className='text-lg font-bold border-none outline-none focus:outline-none bg-transparent p-0 transition transform hover:scale-110 group-hover:text-red-500'
				>
					Categories
					<i className='fa fa-caret-down'></i>
				</button>
				<div
					className={`absolute ${
						isCategoryVisible ? 'block' : 'hidden'
					} mt-2 w-32 bg-white text-black border border-gray-200 rounded-lg shadow-lg z-20`}
				>
					<ul className='list-none p-0'>
						{categories?.map(category => (
							<li
								key={category._id}
								className='text-sm py-1 pl-2 hover:bg-gray-200'
							>
								<a href={`/categories/${category.name}`}>{category.name}</a>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className='relative inline-block group'>
				{loggedIn
					? loggedInMenus.map(menu => (
							<li key={menu.name}>
								{menu.name === 'Logout' ? (
									<a
										href='/'
										onClick={handleLogoutClick}
										className='text-lg font-bold inline-block mr-4 transition transform hover:scale-110 hover:text-red-500'
									>
										{menu.name}
									</a>
								) : (
									<a
										href={menu.href}
										className='text-lg font-bold inline-block mr-4 transition transform hover:scale-110 hover:text-red-500'
									>
										{menu.name}
									</a>
								)}
							</li>
					  ))
					: nonLoggedInMenus.map(menu => (
							<li key={menu.name}>
								<a
									href={menu.href}
									className='text-lg font-bold inline-block mr-4 transition transform hover:scale-110 hover:text-red-500'
								>
									{menu.name}
								</a>
							</li>
					  ))}
			</div>

			{showLogoutConfirmation && (
				<LogoutConfirmation onConfirm={confirmLogout} onCancel={cancelLogout} />
			)}
		</nav>
	)
})
