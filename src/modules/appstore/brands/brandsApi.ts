import { apiSlice } from '../api_slice';

export const brandsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create brand
    createBrand: build.mutation({
      query: (brandData) => ({
        url: '/Brand/create',
        method: 'POST',
        body: brandData,
      }),
      invalidatesTags: ['brands'],
    }),

    // Get all brands
    getBrands: build.query({
      query: (queryString) => ({
        url: `/Brand?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['brands'],
    }),

    // Get single brand
    getSingleBrand: build.query({
      query: (id) => ({
        url: `/Brand/${id}`,
        method: 'GET',
      }),
      providesTags: ['brands'],
    }),

    // Update brand
    updateBrand: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/Brand/update/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['brands'],
    }),

    // Delete brand
    deleteBrand: build.mutation({
      query: (queryString) => ({
        url: `/Brand/batch${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['brands'],
    }),

    // Bulk status change
    bulkStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/Brand/status${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['brands'],
    }),
  }),
});

export const {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetSingleBrandQuery,
  useBulkStatusChangeMutation,
} = brandsApi;
