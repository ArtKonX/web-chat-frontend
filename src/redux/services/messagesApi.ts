import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import constsEnv from '@/environment/environment';
import { DeleteMessageData, DeleteMessageResponse, GetInfoDialoguesData, GetInfoDialoguesResponse, GetMessagesData, GetMessagesResponse, GetNextLengthMessagesData, GetNextLengthMessagesResponse, SendMessageData, SendMessageResponse, SendMessageToBotData, SendMessageToBotResponse, UpdateMessageData, UpdateMessageResponse, UploadFileWithMessData, UploadFileWithMessResponse } from '@/interfaces/redux/messages';

const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: constsEnv.NEXT_BACKEND_URL
    }),
    endpoints: (builder) => ({
        getMessages: builder.mutation<GetMessagesResponse, GetMessagesData>({
            query: ({ currentUserId, userId, offset, token }) => ({
                url: `/get-messages?currentUserId=${currentUserId}&userId=${userId}&offSet=${offset}`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }),
        }),
        sendMessage: builder.mutation<SendMessageResponse, SendMessageData>({
            query: ({ userId, currentUserId, data, token }) => ({
                url: `/create-message?currentUserId=${currentUserId}&userId=${userId}`,
                method: 'POST',
                body: data,
                headers: { 'Authorization': `Bearer ${token}` }
            })
        }),
        sendMessageToBot: builder.mutation<SendMessageToBotResponse, SendMessageToBotData>({
            query: ({ userId, currentUserId, data, token }) => ({
                url: `/send-message-bot?currentUserId=${currentUserId}&userId=${userId}`,
                method: 'POST',
                body: data,
                headers: { 'Authorization': `Bearer ${token}` }
            })
        }),
        uploadFileWithMess: builder.mutation<UploadFileWithMessResponse, UploadFileWithMessData>({
            query: ({ userId, currentUserId, data, token }) => ({
                url: `/upload-file?currentUserId=${currentUserId}&userId=${userId}`,
                method: 'POST',
                body: data,
                headers: { 'Authorization': `Bearer ${token}` }
            })
        }),
        getInfoDialogues: builder.query<GetInfoDialoguesResponse, GetInfoDialoguesData>({
            query: ({ userId, token }) => ({
                url: `/get-info-dialogues?userId=${userId}`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
        }),
        updateMessage: builder.mutation<UpdateMessageResponse, UpdateMessageData>({
            query: ({ messageId, userId, data, token }) => ({
                url: `/update-message?messageId=${messageId}&userId=${userId}`,
                method: 'PATCH',
                body: data,
                headers: { 'Authorization': `Bearer ${token}` }
            })
        }),
        deleteMessage: builder.mutation<DeleteMessageResponse, DeleteMessageData>({
            query: ({ messageId, userId, token }) => ({
                url: `/delete-message?messageId=${messageId}&userId=${userId}`,
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
        }),
        getNextLengthMessages: builder.query<GetNextLengthMessagesResponse, GetNextLengthMessagesData>({
            query: ({ nextOffset, senderId, recipientId, token }) => ({
                url: `/get-length-next-messages?nextOffset=${nextOffset}&senderId=${senderId}&recipientId=${recipientId}`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
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