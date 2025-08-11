import { apiSlice } from '../api_slice';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create category
    createCategory: build.mutation({
      query: (categoryData) => ({
        url: '/category/create',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['categorys'],
    }),
    // Get categories
    getCategory: build.query({
      query: (queryString) => ({
        url: `/category?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['categorys'],
    }),

    // Get single category
    getSingleCategory: build.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
      providesTags: ['categorys'],
    }),
    // Update category
    updateCategory: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `category/update/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['categorys'],
    }),
    // Delete category
    deleteCategory: build.mutation({
      query: (queryString) => ({
        url: `/category/batch${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['categorys'],
    }),

    // Bulk status change
    bulkStatusChangeCategory: build.mutation({
      query: (queryString) => ({
        url: `/category/status${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['categorys'],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSingleCategoryQuery,
  useBulkStatusChangeCategoryMutation,
} = categoryApi;
