import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import SideBarSlice from '../slices/sideBarSlice'
import BackgroundSlice from '../slices/backgroundSlice';
import TokenSlice from '../slices/tokenSlice';

const sideBarDataConfig = {
    key: 'sideBarState',
    storage,
}

export const persistSideBarReducer =
    persistReducer(sideBarDataConfig, SideBarSlice);

const backgroundConfig = {
    key: 'sideBarbackgroundStateState',
    storage,
}

export const persistbackgroundReducer =
    persistReducer(backgroundConfig, BackgroundSlice);

const tokenConfig = {
    key: 'tokenState',
    storage,
}

export const persistTokenReducer =
    persistReducer(tokenConfig, TokenSlice);
