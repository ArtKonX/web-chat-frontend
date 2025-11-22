import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import constsEnv from '@/environment/environment';

const testWorkServerApi = createApi({
    reducerPath: 'testWorkServerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: constsEnv.NEXT_BACKEND_URL
    }),
    endpoints: (builder) => ({
        testWorkServer: builder.query({
            query: () => ({
                url: `/test-work-server`,
                method: 'GET'
            })
        })
    })
});

export const { useTestWorkServerQuery } = testWorkServerApi;
export default testWorkServerApi;