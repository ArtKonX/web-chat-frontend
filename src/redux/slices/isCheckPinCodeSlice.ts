import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

interface IsCheckPinCodeState {
    isCheckPinCode: boolean
}

const initialState = {
    isCheckPinCode: false
} as IsCheckPinCodeState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const IsCheckPinCodeSlice = createSliceWithThunk({
    name: "notFoundState",
    initialState,
    selectors: {
        authState: (state) => state,
    },
    reducers: (create) => ({
        toggleIsCheckPinCode: create.reducer((state) => {
            state.isCheckPinCode = !state.isCheckPinCode
        })
    }),
});

export const { toggleIsCheckPinCode } = IsCheckPinCodeSlice.actions;
export default IsCheckPinCodeSlice.reducer;