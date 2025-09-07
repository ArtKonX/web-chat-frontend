import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import authApi from '../services/authApi';
import usersApi from '../services/usersApi';
import messagesApi from '../services/messagesApi';
import citiesApi from '../services/citiesApi';
import { persistbackgroundReducer, persistSideBarReducer } from '../persist/persistSideBarReducer';
import authSlice from '../slices/authSlice';
import changeMessageSlice from '../slices/changeMessageSlice';
import imageSlice from '../slices/imageSlice';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
        [citiesApi.reducerPath]: citiesApi.reducer,
        sideBarState: persistSideBarReducer,
        backgroundState: persistbackgroundReducer,
        authState: authSlice,
        changeMessageSlice: changeMessageSlice,
        imageSlice: imageSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(
            {
                serializableCheck: {
                    ignoredActions: ['persist/PERSIST'],
                    ignoredPaths: ['persist.register']
                }
            }).concat(authApi.middleware, usersApi.middleware, messagesApi.middleware, citiesApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;