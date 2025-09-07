import { buildCreateSlice, asyncThunkCreator, PayloadAction } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

interface BackgroundState {
    bgColor: string
}

const initialState = {
    bgColor: ''
} as BackgroundState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const BackgroundSlice = createSliceWithThunk({
    name: "backgroundState",
    initialState,
    selectors: {
        backgroundState: (state) => state,
    },
    reducers: (create) => ({
        addColor: create.reducer((state, action: PayloadAction<{ bgColor: string }>) => {
            state.bgColor = action.payload.bgColor;
        })
    }),
});

export default BackgroundSlice.reducer;

const persistConfig = {
    key: 'backgroundState',
    storage,
    whitelist: ['backgroundState'],
};

const persistedReducer = persistReducer(persistConfig, BackgroundSlice.reducer);

export const { addColor } = BackgroundSlice.actions;
export const reducer = persistedReducer;