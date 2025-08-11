import { apiSlice } from '../api_slice';

interface status {
  id: number;
  name: string;
}

interface ProductData {
  name: string;
  sku: string;
  barcode: string;
  price: string;
  discountPrice: string;
  totalStock: number;
  category: any;
  description: string;
  brand: any;
  stockStatus: string;
  tags: any[];
  attributes: any[];
  featureImage: any;
  galleryImages: any[];
  status: status;
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create product
    createProduct: build.mutation({
      query: (productData) => ({
        url: '/product/create',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),

    // Get all products
    getProducts: build.query({
      query: (queryString) => ({
        url: `/product?${queryString}`,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),

    // Get single product
    getSingleProduct: build.query({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: ProductData) => {
        const productData = response;
        return {
          name: productData.name,
          sku: productData.sku,
          barcode: productData.barcode,
          price: parseInt(productData.price),
          discountPrice: parseInt(productData.discountPrice),
          totalStock: productData.totalStock,
          categoryId: productData.category?.id,
          brandId: productData.brand?.id,
          stockStatus: productData.stockStatus,
          tagIds: productData.tags && productData.tags.map((tag) => tag.id),
          attributeIds:
            productData.attributes &&
            productData.attributes.map((attr) => attr.id),
          featureImage: productData.featureImage?.id,
          galleryImages:
            productData.galleryImages &&
            productData.galleryImages.map((image) => image.id),
          description: productData.description,
          status: productData.status,
        };
      },
      providesTags: ['Product'],
    }),

    // Update product
    updateProduct: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `/product/update/${id}`,
        method: 'PATCH',
        body: updatedData,
      }),
      invalidatesTags: ['Product'],
    }),

    // Delete products
    deleteProducts: build.mutation({
      query: (queryString) => ({
        url: `/product/batch/${queryString}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Bulk status change
    bulkProductStatusChange: build.mutation({
      query: (queryString) => ({
        url: `/product/status/${queryString}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductsMutation,
  useBulkProductStatusChangeMutation,
} = productsApi;
