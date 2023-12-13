import { observer } from 'mobx-react-lite'
import { useContext, useEffect } from 'react'
import { Profile } from '../../components/Profile'
import { StoreContext } from '../../store/context'

export const AuthProfileRoute = observer(() => {
	const { accountStore, feedResourceStore } = useContext(StoreContext)
	const user = accountStore.data
	const userFiles = feedResourceStore.files
	const loggedIn = !!user

	useEffect(() => {
		if (user) {
			feedResourceStore.fetchUserData({ userId: user?.id! })
		}
	}, [user])

	if (!accountStore.isLoaded) {
		return <div>Loading...</div>
	}

	return <Profile loggedIn={loggedIn} user={user} files={userFiles} />
})
