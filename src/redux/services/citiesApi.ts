import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import constsEnv from '@/environment/environment';
import { GetCitiesData, GetCitiesResponse } from '@/interfaces/redux/cities';

const citiesApi = createApi({
    reducerPath: 'citiesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: constsEnv.NEXT_BACKEND_URL
    }),
    endpoints: (builder) => ({
        getCities: builder.query<GetCitiesResponse, GetCitiesData>({
            query: ({ q }) => ({
                url: `/get-cities?q=${q}`,
                method: 'GET'
            })
        })
    })
});

export const { useGetCitiesQuery } = citiesApi;
export default citiesApi;
