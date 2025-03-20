import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuth } from '../services/userAuthApi'
import authReducer from '../features/authSlice'
import userReducer from '../features/userSlice'
import profileReducer from '../features/userProfile'


export const store = configureStore({
    reducer: {
        [userAuth.reducerPath]: userAuth.reducer,
        auth: authReducer,
        user: userReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAuth.middleware),
})

setupListeners(store.dispatch)