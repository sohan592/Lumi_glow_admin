import { apiSlice } from '../api_slice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Get single brand
    getLoggedProfile: build.query({
      query: () => ({
        url: `/auth/me`,
        method: 'GET',
      }),
      providesTags: ['admin'],
    }),

    // Update brand
    updateLoggedProfile: build.mutation({
      query: ({ updatedData }) => ({
        url: `/auth/me`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['admin'],
    }),
  }),
});

export const { useGetLoggedProfileQuery, useUpdateLoggedProfileMutation } =
  adminApi;
