import { apiSlice } from '../api_slice';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Get all orders
    getOrders: build.query({
      query: (queryString) => ({
        url: `/admin/checkout?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['orders'],
    }),

    // Get dashboard stats
    getOrderStats: build.query({
      query: () => ({
        url: '/admin/checkout/stats',
        method: 'GET',
      }),
      providesTags: ['orderStats'],
    }),

    getOrderStatsHistory: build.query({
      query: (id) => ({
        url: `/admin/checkout/${id}/status-history`,
        method: 'GET',
      }),
      providesTags: ['orderStats'],
    }),

    // get for checkout
    getViewOrder: build.query({
      query: (id) => ({
        url: `/admin/checkout/${id}`,
        method: 'GET',
      }),

      providesTags: ['orders'],
    }),

    // Get user orders
    getUserOrders: build.query({
      query: ({ id, limit, page }) => ({
        url: `/admin/checkout/user/${id}?limit=${limit}&page=${page}`,
        method: 'GET',
      }),
      providesTags: ['orders'],
    }),

    // Update order status
    updateOrderStatus: build.mutation({
      query: ({ id, statusId, body }) => ({
        url: `/admin/checkout/${id}/status/${statusId}`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['orders', 'orderStats'],
    }),

    // Update payment status
    updatePaymentStatus: build.mutation({
      query: ({ id, body }) => ({
        url: `/admin/checkout/${id}/payment`,
        method: 'PATCH',
        body: body,
      }),
      invalidatesTags: ['orders', 'orderStats'],
    }),

    // Cancel order
    cancelOrder: build.mutation({
      query: (id) => ({
        url: `/admin/checkout/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orders', 'orderStats'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useGetUserOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderMutation,
  useGetViewOrderQuery,
  useGetOrderStatsHistoryQuery,
} = ordersApi;
