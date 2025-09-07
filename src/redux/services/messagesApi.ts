import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import constsEnv from '@/environment/environment';
import { DeleteMessageData, DeleteMessageResponse, GetInfoDialoguesData, GetInfoDialoguesResponse, GetMessagesData, GetMessagesResponse, GetNextLengthMessagesData, GetNextLengthMessagesResponse, SendMessageData, SendMessageResponse, SendMessageToBotData, SendMessageToBotResponse, UpdateMessageData, UpdateMessageResponse, UploadFileWithMessData, UploadFileWithMessResponse } from '@/interfaces/redux/messages';

const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: constsEnv.NEXT_BACKEND_URL,
        credentials: 'include' // Для работы с cookies
    }),
    endpoints: (builder) => ({
        getMessages: builder.mutation<GetMessagesResponse, GetMessagesData>({
            query: ({ currentUserId, userId, offset }) => ({
                url: `/get-messages?currentUserId=${currentUserId}&userId=${userId}&offSet=${offset}`,
                method: 'GET'
            }),
        }),
        sendMessage: builder.mutation<SendMessageResponse, SendMessageData>({
            query: ({ userId, currentUserId, data }) => ({
                url: `/create-message?currentUserId=${currentUserId}&userId=${userId}`,
                method: 'POST',
                body: data
            })
        }),
        sendMessageToBot: builder.mutation<SendMessageToBotResponse, SendMessageToBotData>({
            query: ({ userId, currentUserId, data }) => ({
                url: `/send-message-bot?currentUserId=${currentUserId}&userId=${userId}`,
                method: 'POST',
                body: data
            })
        }),
        uploadFileWithMess: builder.mutation<UploadFileWithMessResponse, UploadFileWithMessData>({
            query: ({ userId, currentUserId, data }) => ({
                url: `/upload-file?currentUserId=${currentUserId}&userId=${userId}`,
                method: 'POST',
                body: data
            })
        }),
        getInfoDialogues: builder.query<GetInfoDialoguesResponse, GetInfoDialoguesData>({
            query: ({ userId }) => ({
                url: `/get-info-dialogues?userId=${userId}`,
                method: 'GET'
            })
        }),
        updateMessage: builder.mutation<UpdateMessageResponse, UpdateMessageData>({
            query: ({ messageId, userId, data }) => ({
                url: `/update-message?messageId=${messageId}&userId=${userId}`,
                method: 'PATCH',
                body: data
            })
        }),
        deleteMessage: builder.mutation<DeleteMessageResponse, DeleteMessageData>({
            query: ({ messageId, userId }) => ({
                url: `/delete-message?messageId=${messageId}&userId=${userId}`,
                method: 'DELETE'
            })
        }),
        getNextLengthMessages: builder.query<GetNextLengthMessagesResponse, GetNextLengthMessagesData>({
            query: ({ nextOffset, senderId, recipientId }) => ({
                url: `/get-length-next-messages?nextOffset=${nextOffset}&senderId=${senderId}&recipientId=${recipientId}`,
                method: 'GET'
            })
        })
    })
});

export const { useGetMessagesMutation, useSendMessageMutation,
    useUploadFileWithMessMutation, useSendMessageToBotMutation,
    useGetInfoDialoguesQuery, useUpdateMessageMutation,
    useDeleteMessageMutation, useGetNextLengthMessagesQuery
} = messagesApi;
export default messagesApi;