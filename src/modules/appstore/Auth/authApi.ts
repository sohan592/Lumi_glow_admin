import { apiSlice } from '../api_slice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (body) => {
        return {
          url: '/auth/email/login',
          method: 'POST',
          body,
        };
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          localStorage.setItem(
            'auth',
            JSON.stringify({
              token: result?.data?.token,
              refreshToken: result?.data?.refreshToken,
              tokenExpires: result?.data?.tokenExpires,
              user: result?.data?.user,
            }),
          );
        } catch (error) {}
      },
    }),
    signOut: build.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('auth');
        } catch (error) {}
      },
    }),

    getProfile: build.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useSignInMutation, useSignOutMutation, useGetProfileQuery } =
  authApi;
