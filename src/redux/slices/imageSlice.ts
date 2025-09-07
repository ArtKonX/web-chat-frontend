import { buildCreateSlice, asyncThunkCreator, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
    isShowImage?: boolean,
    url: null | string
}

const initialState = {
    isShowImage: false,
    url: null
} as ImageState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const ImageSlice = createSliceWithThunk({
    name: "imageState",
    initialState,
    selectors: {
        imageState: (state) => state,
    },
    reducers: (create) => ({
        addUrl: create.reducer((state, action: PayloadAction<ImageState>) => {
            const { url } = action.payload;

            state.isShowImage = true;
            state.url = url
        }),
        resetUrl: create.reducer((state) => {
            state.isShowImage = false;
            state.url = null
        }),
    }),
});

export const { addUrl, resetUrl } = ImageSlice.actions;
export default ImageSlice.reducer;