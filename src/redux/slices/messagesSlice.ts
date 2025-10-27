import { buildCreateSlice, asyncThunkCreator, PayloadAction } from "@reduxjs/toolkit";

interface MessagesState {
    messagesLenObj: {
        [key in string]: number
    }
}

const initialState = {
    messagesLenObj: {}
} as MessagesState

const createSliceWithThunk = buildCreateSlice({
    creators: { asyncThunk: asyncThunkCreator },
});

const MessagesSlice = createSliceWithThunk({
    name: "messagesState",
    initialState,
    selectors: {
        messagesState: (state) => state,
    },
    reducers: (create) => ({
        addMessageLen: create.reducer((state, action: PayloadAction<{ numberMessages: number, id: string }>) => {
            const { numberMessages, id } = action.payload;

            state.messagesLenObj[id] = numberMessages
        }),
    }),
});

export const { addMessageLen } = MessagesSlice.actions;
export default MessagesSlice.reducer;