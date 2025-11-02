import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

interface WindowState {
    isShowWindow: boolean
}

const initialState = {
    isShowWindow: false
} as WindowState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const WindowSlice = createSliceWithThunk({
    name: "windowState",
    initialState,
    selectors: {
        windowState: (state) => state,
    },
    reducers: (create) => ({
        toggleIsWindow: create.reducer(state => {
            state.isShowWindow = !state.isShowWindow
        })
    }),
});

export const { toggleIsWindow } = WindowSlice.actions;
export default WindowSlice.reducer;