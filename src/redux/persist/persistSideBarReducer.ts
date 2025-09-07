import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import SideBarSlice from '../slices/sideBarSlice'
import BackgroundSlice from '../slices/backgroundSlice';

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