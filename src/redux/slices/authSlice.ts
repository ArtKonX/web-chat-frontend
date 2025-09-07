import { buildCreateSlice, asyncThunkCreator, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    type: string | null,
    email?: string,
    password?: string,
    name?: string,
    id?: string
}

const initialState = {
    type: null,
    email: '',
    password: '',
    name: '',
    id: ''
} as AuthState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const AuthSlice = createSliceWithThunk({
    name: "authState",
    initialState,
    selectors: {
        authState: (state) => state,
    },
    reducers: (create) => ({
        addDataAuth: create.reducer((state, action: PayloadAction<{ type: string | null, email?: string, password?: string, name?: string, id?: string }>) => {
            const { type, email, password, name, id } = action.payload;

            if (type === 'login') {
                state.email = email;
                state.password = password;
            } else if (type === 'update') {
                state.name = name;
                state.id = id;
                state.password = password;
            } else {
                console.log('Не распознано действие')
            }
        }),
        resetDataAuth: create.reducer((state) => {
            state.email = '';
            state.password = '';
            state.name = '';
            state.id = '';
        }),
    }),
});

export const { addDataAuth, resetDataAuth } = AuthSlice.actions;
export default AuthSlice.reducer;