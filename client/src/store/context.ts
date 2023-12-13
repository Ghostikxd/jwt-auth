import { createContext } from 'react'

import { AccountStore } from './account'
import { CategoryStore } from './category'
import { FeedStore } from './feed'
import { FeedResourceStore } from './feed-resource'
import { FileStore } from './file'
import { UserStore } from './user'

type StateStore = typeof stores

export const stores = {
	accountStore: new AccountStore(),
	fileStore: new FileStore(),
	feedStore: new FeedStore(),
	feedResourceStore: new FeedResourceStore(),
	categoryStore: new CategoryStore(),
	userStore: new UserStore(),
}
export const StoreContext = createContext<StateStore>({} as StateStore)
