import { apiSlice } from '../api_slice';

interface status {
  id: number;
  name: string;
}

interface CouponData {
  id: number;
  campaignName: string;
  code: string;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  maxUses: number;
  maxUsesPerUser: number;
  categories?: any[];
  products?: any[];
  minOrderAmount: string;
  maxDiscountAmount: string | null;
  description: string;
  usageCount: number;
  status: status;
}

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create coupon
    createCoupon: build.mutation({
      query: (couponData) => ({
        url: '/Coupons',
        method: 'POST',
        body: couponData,
      }),
      invalidatesTags: ['coupons'],
    }),

    // Get all coupons
    getCoupons: build.query({
      query: (queryString) => ({
        url: `/Coupons?${queryString}`,
        method: 'GET',
      }),

      providesTags: ['coupons'],
    }),

    // Get single coupon
    getSingleCoupon: build.query({
      query: (id) => ({
        url: `/Coupons/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: CouponData) => {
        const productData = response;
        return {
          id: productData.id,
          campaignName: productData.campaignName,
          code: productData.code,
          discountType: productData.discountType,
          discountValue: productData.discountValue,
          startDate: productData.startDate,
          endDate: productData.endDate,
          maxUses: productData.maxUses,
          maxUsesPerUser: productData.maxUsesPerUser,
          minOrderAmount: productData.minOrderAmount,
          maxDiscountAmount: productData.maxDiscountAmount,
          description: productData.description,
          usageCount: productData.usageCount,
          status: productData?.status?.id,
          productIds: productData.products?.map((product) => product.id) || [],
          categoryIds:
            productData.categories?.map((category) => category.id) || [],
        };
      },
      providesTags: ['coupons'],
    }),

    // Update coupon
    updateCoupon: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/Coupons/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['coupons'],
    }),

    // Delete coupon
    deleteCoupon: build.mutation({
      query: (queryString) => ({
        url: `/Coupons/batch${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['coupons'],
    }),

    // Bulk status change for coupons
    bulkCouponStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/Coupons/status${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['coupons'],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetSingleCouponQuery,
  useBulkCouponStatusChangeMutation,
} = couponApi;
