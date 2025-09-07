import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import constsEnv from '@/environment/environment';
import { CheckAuthData, CheckAuthResponse, GetPublicKeysData, GetPublicKeysResponse, LoginData, LoginResponse, LogoutData, LogoutResponse, RegistarationData, RegistarationResponse, TurnOff2FAData, TurnOff2FAResponse, TurnOn2FAData, TurnOn2FAResponse, UpdateCityData, UpdateCityResponse, UpdateUserData, UpdateUserResponse } from '@/interfaces/redux/auth';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: constsEnv.NEXT_BACKEND_URL,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginData>({
            query: (data) => ({
                url: '/sing-in',
                method: 'POST',
                body: data
            })
        }),
        registaration: builder.mutation<RegistarationResponse, RegistarationData>({
            query: (data) => ({
                url: '/registration',
                method: 'POST',
                body: data
            })
        }),
        logout: builder.mutation<LogoutResponse, LogoutData>({
            query: () => ({
                url: '/logout',
                method: 'POST'
            })
        }),
        updateUser: builder.mutation<UpdateUserResponse, UpdateUserData>({
            query: (data) => ({
                url: '/update-user',
                method: 'PATCH',
                body: data
            })
        }),
        checkAuth: builder.query<CheckAuthResponse, CheckAuthData>({
            query: () => ({
                url: '/get-user',
                method: 'GET',
            })
        }),
        getPublicKeys: builder.query<GetPublicKeysResponse, GetPublicKeysData>({
            query: ({ recipientId, senderId }) => ({
                url: `/get-public-keys?recipientId=${recipientId}&senderId=${senderId}`,
                method: 'GET',
            })
        }),
        updateCity: builder.mutation<UpdateCityResponse, UpdateCityData>({
            query: (data) => ({
                url: `/update-city`,
                method: 'PATCH',
                body: data
            })
        }),
        turnOn2FA: builder.mutation<TurnOn2FAResponse, TurnOn2FAData>({
            query: (data) => ({
                url: `/2FA-on`,
                method: 'POST',
                body: data
            })
        }),
        turnOff2FA: builder.mutation<TurnOff2FAResponse, TurnOff2FAData>({
            query: (data) => ({
                url: `/2FA-disable`,
                method: 'POST',
                body: data
            })
        })
    })
});

export const { useGetPublicKeysQuery, useRegistarationMutation,
    useUpdateUserMutation, useCheckAuthQuery,
    useLogoutMutation, useLoginMutation,
    useUpdateCityMutation, useTurnOn2FAMutation,
    useTurnOff2FAMutation } = authApi;
export default authApi;