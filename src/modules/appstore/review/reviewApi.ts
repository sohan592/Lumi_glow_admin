import { apiSlice } from '../api_slice';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Get all reviews
    getReviews: build.query({
      query: (queryParams) => ({
        url: `/reviews?${queryParams}`,
        method: 'GET',
      }),
      providesTags: ['reviews'],
    }),

    // Get single review
    getSingleReview: build.query({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'GET',
      }),
      providesTags: ['reviews'],
    }),

    // Update review
    updateReview: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/reviews/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['reviews'],
    }),

    // Delete reviews
    deleteReviews: build.mutation({
      query: (queryString) => ({
        url: `/reviews/batch/${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['reviews'],
    }),

    // Bulk status change
    bulkReviewStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/reviews/status/${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['reviews'],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetSingleReviewQuery,
  useUpdateReviewMutation,
  useDeleteReviewsMutation,
  useBulkReviewStatusChangeMutation,
} = reviewApi;
