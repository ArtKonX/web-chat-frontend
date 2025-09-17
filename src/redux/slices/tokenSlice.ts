import { buildCreateSlice, asyncThunkCreator, PayloadAction } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

interface TokenState {
    token: string
}

const initialState = {
    token: ''
} as TokenState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const TokenSlice = createSliceWithThunk({
    name: "tokenState",
    initialState,
    selectors: {
        tokenState: (state) => state,
    },
    reducers: (create) => ({
        addToken: create.reducer((state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        }),
        removeToken: create.reducer(state => {
            state.token = '';
        })
    }),
});

export default TokenSlice.reducer;

const persistConfig = {
    key: 'tokenState',
    storage,
    whitelist: ['tokenState'],
};

const persistedReducer = persistReducer(persistConfig, TokenSlice.reducer);

export const { addToken, removeToken } = TokenSlice.actions;
export const reducer = persistedReducer;