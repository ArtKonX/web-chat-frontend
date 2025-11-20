import { buildCreateSlice, asyncThunkCreator } from "@reduxjs/toolkit";

interface NotFoundState {
    isNotFound: boolean
}

const initialState = {
    isNotFound: false
} as NotFoundState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const NotFoundSlice = createSliceWithThunk({
    name: "notFoundState",
    initialState,
    selectors: {
        authState: (state) => state,
    },
    reducers: (create) => ({
        toggleIsFound: create.reducer((state) => {
            state.isNotFound = !state.isNotFound
        })
    }),
});

export const { toggleIsFound } = NotFoundSlice.actions;
export default NotFoundSlice.reducer;