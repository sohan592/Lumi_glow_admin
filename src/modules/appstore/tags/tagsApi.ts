import { apiSlice } from '../api_slice';

export const tagsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create tag
    createTag: build.mutation({
      query: (tagData) => ({
        url: '/tag/create',
        method: 'POST',
        body: tagData,
      }),
      invalidatesTags: ['Tag'],
    }),

    // Get all tags
    getTags: build.query({
      query: (queryString) => ({
        url: `/tag?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['Tag'],
    }),

    // Get single tag
    getSingleTag: build.query({
      query: (id) => ({
        url: `/tag/${id}`,
        method: 'GET',
      }),
      providesTags: ['Tag'],
    }),

    // Update tag
    updateTag: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/tag/update/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Tag'],
    }),

    // Delete tags
    deleteTags: build.mutation({
      query: (queryString) => ({
        url: `/tag/batch${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tag'],
    }),

    // Bulk status change
    bulkTagStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/tag/status${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Tag'],
    }),
  }),
});

export const {
  useCreateTagMutation,
  useGetTagsQuery,
  useGetSingleTagQuery,
  useUpdateTagMutation,
  useDeleteTagsMutation,
  useBulkTagStatusChangeMutation,
} = tagsApi;
