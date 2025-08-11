import { apiSlice } from '../api_slice';

export const dashbordApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCheckoutStats: build.query({
      query: () => ({
        url: `/admin/checkout/stats`,
        method: 'GET',
      }),
      providesTags: ['dashbord'],
    }),
  }),
});

export const { useGetCheckoutStatsQuery } = dashbordApi;
