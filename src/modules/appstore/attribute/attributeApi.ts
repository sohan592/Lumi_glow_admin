import { apiSlice } from '../api_slice';

export const attributesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create attribute
    createAttribute: build.mutation({
      query: (attributeData) => ({
        url: '/attribute/create',
        method: 'POST',
        body: attributeData,
      }),
      invalidatesTags: ['attributes'],
    }),

    // Get all attributes
    getAttributes: build.query({
      query: (queryString) => ({
        url: `/attribute?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['attributes'],
    }),

    // Get single attribute
    getSingleAttribute: build.query({
      query: (id) => ({
        url: `/attribute/${id}`,
        method: 'GET',
      }),
      providesTags: ['attributes'],
    }),

    // Update attribute
    updateAttribute: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/attribute/update/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['attributes'],
    }),

    // Delete attribute
    deleteAttribute: build.mutation({
      query: (queryString) => ({
        url: `/attribute/batch/${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['attributes'],
    }),

    // Bulk status change
    bulkAttributeStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/attribute/status/${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['attributes'],
    }),
  }),
});

export const {
  useCreateAttributeMutation,
  useGetAttributesQuery,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useGetSingleAttributeQuery,
  useBulkAttributeStatusChangeMutation,
} = attributesApi;
