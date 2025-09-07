import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

interface SideBarState {
    isShow: boolean
}

const initialState = {
    isShow: true
} as SideBarState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const SideBarSlice = createSliceWithThunk({
    name: "sideBarState",
    initialState,
    selectors: {
        sideBarState: (state) => state,
    },
    reducers: (create) => ({
        toggleSideBar: create.reducer((state) => {
            state.isShow = !state.isShow;
        })
    }),
});

export default SideBarSlice.reducer;

const persistConfig = {
    key: 'sideBarState',
    storage,
    whitelist: ['sideBarState'],
};

const persistedReducer = persistReducer(persistConfig, SideBarSlice.reducer);

export const { toggleSideBar } = SideBarSlice.actions;
export const reducer = persistedReducer;