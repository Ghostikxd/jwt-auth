import { observer } from 'mobx-react-lite'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import { StoreContext } from '../store/context'

export const LoginForm = observer(() => {
	const navigate = useNavigate()
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const { accountStore } = useContext(StoreContext)

	return (
		<section className='bg-gray-200 '>
			<div className='flex flex-col items-center justify-center px-6 py-8 mx-auto'>
				<div className='mx-auto'>
					<h2 className='text-2xl font-bold mb-5 text-center'>Log In</h2>
				</div>
				<div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
					<div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
						<div className=''>
							<label htmlFor='email' className='block mb-2 text-sm font-medium'>
								Your email
							</label>
							<input
								onChange={e => setEmail(e.target.value)}
								value={email}
								type='email'
								name='email'
								id='email'
								className='border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500'
								placeholder='Email address'
							/>
						</div>
						<div>
							<label
								htmlFor='password'
								className='block mb-2 text-sm font-medium'
							>
								Password
							</label>
							<input
								onChange={e => setPassword(e.target.value)}
								value={password}
								type='password'
								name='password'
								id='password'
								placeholder='••••••••'
								className='border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500'
							/>
						</div>
						<button
							className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClick={async () => {
								const loginSuccess = await accountStore.login(email, password)

								if (loginSuccess) {
									navigate('/')
								}
							}}
						>
							Log In
						</button>
						<p className='text-sm font-light text-gray-500 dark:text-gray-400'>
							Don't have an account yet?{' '}
							<a
								href='/auth/signup'
								className='font-medium text-blue-600 hover:underline dark:text-blue-500'
							>
								Sign up
							</a>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
})
