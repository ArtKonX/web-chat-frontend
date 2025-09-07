import { buildCreateSlice, asyncThunkCreator, PayloadAction } from "@reduxjs/toolkit";

interface ChangeMessageState {
    isChange: boolean,
    message: string,
    id?: string
}

const initialState = {
    isChange: false,
    id: '0',
    message: ''

} as ChangeMessageState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const ChangeMessageSlice = createSliceWithThunk({
    name: "changeMessageState",
    initialState,
    selectors: {
        changeMessageState: (state) => state,
    },
    reducers: (create) => ({
        addDataChangeMessage: create.reducer((state, action: PayloadAction<{ message: string, id?: string }>) => {
            const { message, id } = action.payload;

            state.isChange = true
            state.message = message;
            state.id = id
        }),
        addIsChange: create.reducer((state) => {

            state.isChange = true
        }),
        resetDataChangeMessage: create.reducer((state) => {
            state.isChange = false;
            state.message = '';
        }),
    }),
});

export const { addDataChangeMessage, addIsChange, resetDataChangeMessage } = ChangeMessageSlice.actions;
export default ChangeMessageSlice.reducer;