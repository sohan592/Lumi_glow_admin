import { apiSlice } from '../api_slice';

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMedias: build.query({
      query: (mediaQueryString) => {
        return `/media${mediaQueryString}`;
      },
      providesTags: ['Media'],
    }),

    deleteMedia: build.mutation({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),

    addFiles: build.mutation({
      query: (data) => {
        return {
          url: '/media/upload/multiple',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Media'],
    }),

    getOneFile: build.query({
      query: (id) => `/media/${id}`,
    }),

    getMediasByIds: build.mutation({
      query: (params) => ({
        url: '/media/by-ids',
        method: 'POST',
        body: { ids: params.ids },
      }),
    }),
  }),
});

export const {
  useGetMediasQuery,
  useAddFilesMutation,
  useDeleteMediaMutation,
  useGetOneFileQuery,
  useGetMediasByIdsMutation,
} = mediaApi;
