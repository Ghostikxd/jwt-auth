import { createBrowserRouter } from 'react-router-dom'
import { IndexRoute } from '.'
import { AppLayout } from '../layouts/App'
import { AuthLayout } from '../layouts/Auth'
import { AuthLoginRoute } from './auth/login'
import { AuthProfileRoute } from './auth/profile'
import { AuthSignUpRoute } from './auth/signup'
import { CategoryRoute } from './category'
import { FilePageRoute } from './filepage'
import { UserPageRoute } from './userPage'

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <IndexRoute />,
			},
			{
				element: <AuthLayout />,
				children: [
					{
						path: '/auth/login',
						element: <AuthLoginRoute />,
					},
					{
						path: '/auth/signup',
						element: <AuthSignUpRoute />,
					},
					{
						path: '/auth/profile',
						element: <AuthProfileRoute />,
					},
				],
			},
			{
				path: '/categories/:category',
				element: <CategoryRoute />,
			},
			{
				path: '/photo/:title',
				element: <FilePageRoute />,
			},
			{
				path: '/profile/:userId',
				element: <UserPageRoute />,
			},
		],
	},
])
