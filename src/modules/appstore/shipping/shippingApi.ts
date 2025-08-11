import { apiSlice } from '../api_slice';

export const shippingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create shipping method
    createShippingMethod: build.mutation({
      query: (shippingData) => ({
        url: '/shipping',
        method: 'POST',
        body: shippingData,
      }),
      invalidatesTags: ['shipping'],
    }),

    // Get all shipping methods
    getShippingMethods: build.query({
      query: (queryString) => ({
        url: `/shipping?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['shipping'],
    }),

    // Get single shipping method
    getSingleShippingMethod: build.query({
      query: (id) => ({
        url: `/shipping/${id}`,
        method: 'GET',
      }),
      providesTags: ['shipping'],
    }),

    // Update shipping method
    updateShippingMethod: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/shipping/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['shipping'],
    }),

    // Delete shipping method
    deleteShippingMethod: build.mutation({
      query: (queryString) => ({
        url: `/shipping/batch${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['shipping'],
    }),

    // Bulk status change
    bulkShippingStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/shipping/status${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['shipping'],
    }),
  }),
});

export const {
  useCreateShippingMethodMutation,
  useGetShippingMethodsQuery,
  useUpdateShippingMethodMutation,
  useDeleteShippingMethodMutation,
  useGetSingleShippingMethodQuery,
  useBulkShippingStatusChangeMutation,
} = shippingApi;
