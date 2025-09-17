import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import constsEnv from '@/environment/environment';
import { GetUsersData, GetUsersResponse } from '@/interfaces/redux/users';

const authApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: constsEnv.NEXT_BACKEND_URL
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<GetUsersResponse, GetUsersData>({
            query: ({ q, currentId, token }) => ({
                url: `/get-users?q=${encodeURIComponent(q)}&currentId=${currentId}`,
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
        })
    })
});

export const { useGetUsersQuery } = authApi;
export default authApi;