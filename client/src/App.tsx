// import { Context } from '.'

/* function App() {
	const { store } = useContext(Context)
	const [users, setUsers] = useState<IUser[]>([])
	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth()
		}
	}, [])

	async function getUsers() {
		try {
			const response = await UserService.fetchUsers()
			setUsers(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	if (store.isLoading) {
		return <div>Loading...</div>
	}

	if (!store.isAuth) {
		return (
			<div className='text-center mt-10 space-x-10 '>
				<h1 className='text-xl'>You need to login</h1>
				<Link to='/login' className='text-blue-600 hover:underline'>
					Login
				</Link>
				<Link to='/signup' className='text-blue-600 hover:underline ml-3'>
					Signup
				</Link>
				<button
					onClick={getUsers}
					className='bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5'
				>
					Get all users
				</button>
			</div>
		)
	}

	return (
		<div className='text-center mt-10 space-x-10 '>
			<h1 className='text-2xl font-bold mb-5 text-center'>
				{store.isAuth
					? `User authorized ${store.user.email}`
					: 'You need to login'}
			</h1>
			<h1 className='mb-5 text-center'>
				{store.user.isActivated
					? 'Account confirmed by email'
					: 'Confirm your account'}
			</h1>
			<div className='text-center space-x-10 items-center'>
				<button
					onClick={() => store.logout()}
					className='bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5'
				>
					Logout
				</button>
				<button
					onClick={getUsers}
					className='bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-5'
				>
					Get all users
				</button>
			</div>
			{users.map(user => (
				<div key={user.email} className='mt-5'>
					{user.email}
				</div>
			))}
		</div>
	)
}

export default observer(App)
 */

export {}
