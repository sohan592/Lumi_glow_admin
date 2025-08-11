import { apiSlice } from '../api_slice';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create customer
    createCustomer: build.mutation({
      query: (customerData) => ({
        url: '/users/create',
        method: 'POST',
        body: customerData,
      }),
      invalidatesTags: ['customer'],
    }),

    // Get all customers
    getCustomers: build.query({
      query: (queryString) => ({
        url: `/users?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['customer'],
    }),

    // Get single customer
    getSingleCustomer: build.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: ['customer'],
    }),

    // Update customer
    updateCustomer: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/users/update/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['customer'],
    }),

    // Delete customers
    deleteCustomers: build.mutation({
      query: (queryString) => ({
        url: `/users/batch/${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['customer'],
    }),

    // Bulk status change
    bulkCustomerStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/users/status/${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['customer'],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetCustomersQuery,
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomersMutation,
  useBulkCustomerStatusChangeMutation,
} = customerApi;
