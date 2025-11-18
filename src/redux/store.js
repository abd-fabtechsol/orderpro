import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
} from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import authSlice from "./authSlice"

const rootReducer = combineReducers({ auth: authSlice })

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
	whitelist: ['auth'] // Persist the auth slice
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
})

const persistor = persistStore(store)

export { store, persistor }
