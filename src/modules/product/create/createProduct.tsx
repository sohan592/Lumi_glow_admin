import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Card,
  Button,
} from 'antd';
import {
  BarcodeOutlined,
  PlusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';

import ButtonComponent from '@/@components/form/button';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import SubmitButton from '../attributes/components/FormSubmitButton';
import MediaSelect from '@/modules/media/media-select';

// import { useGetAttributesQuery } from '@/modules/appstore/attribute/attributeApi';
import { useGetBrandsQuery } from '@/modules/appstore/brands/brandsApi';
import { useGetCategoryQuery } from '@/modules/appstore/category/categoryApi';
import { useGetTagsQuery } from '@/modules/appstore/tags/tagsApi';
import {
  useCreateProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from '@/modules/appstore/product/productsApi';

const STOCK_STATUS_OPTIONS = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
  { value: 'back_order', label: 'Back Order' },
  { value: 'pre_order', label: 'Pre Order' },
];

const ProductCreate: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  // State
  const [status, setStatus] = useState<number | null>(null);
  const [isStockStatusOutOfStock, setIsStockStatusOutOfStock] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries and Mutations
  const { data: productData, isLoading: isLoadingProduct } =
    useGetSingleProductQuery(id || '', { skip: !id });
  const { data: categories } = useGetCategoryQuery('');
  // const { data: attributes, isLoading: attributesLoading } =
  //   useGetAttributesQuery('');
  const { data: tagsData } = useGetTagsQuery('page=1&limit=1000');
  const { data: brandsData } = useGetBrandsQuery('');
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Effect for populating form in edit mode
  useEffect(() => {
    if (productData) {
      form.setFieldsValue({
        name: productData.name,
        sku: productData.sku,
        barcode: productData.barcode,
        price: productData.price,
        discountPrice: productData.discountPrice,
        totalStock: productData.totalStock,
        categoryId: productData.categoryId,
        brandId: productData.brandId,
        stockStatus: productData.stockStatus,
        tagIds: productData.tagIds,
        // attributeIds: productData.attributeIds,
        featureImage: productData.featureImage,
        galleryImages: productData.galleryImages,
        description: productData.description,
      });
    }
  }, [productData, form]);

  const generateSKU = () => {
    const prefix = 'PRD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  };

  const generateBarcode = () => {
    const prefix = '200';
    const timestamp = Date.now().toString().slice(-9);
    const checksum = Math.floor(Math.random() * 10);
    return `${prefix}${timestamp}${checksum}`;
  };

  const onFinish = async (values: any) => {
    try {
      setIsSubmitting(true);
      const finalData = {
        ...values,
        status: status ?? (id ? productData?.status : 1),
      };

      if (id) {
        await updateProduct({ id, updatedData: finalData }).unwrap();
        message.success('Product updated successfully');
      } else {
        await createProduct(finalData).unwrap();
        message.success('Product created successfully');
      }

      navigate('/products');
    } catch (error: any) {
      message.error(
        `Failed to ${id ? 'update' : 'create'} product: ${error.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStockStatusChange = (value: string) => {
    if (value === 'out_of_stock') {
      form.setFieldValue('totalStock', 0);
    }
    setIsStockStatusOutOfStock(value === 'out_of_stock');
  };

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Products', url: '/products' },
    { title: id ? 'Update Product' : 'Add Product' },
  ];

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingOutlined className="text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={id ? 'Update Product' : 'Add Product'}
        breadcrumbItems={breadcrumbItems}
      >
        <Space>
          <ButtonComponent
            href="/products"
            className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            disabled={isSubmitting}
          >
            Discard
          </ButtonComponent>
          <SubmitButton
            form={form}
            loading={isSubmitting}
            onClick={() => {
              setStatus(1);
              form.submit();
            }}
          >
            {id ? 'Update Product' : 'Save Product'}
          </SubmitButton>
        </Space>
      </BreadcrumbHeader>

      <Card className="mt-6 shadow-lg rounded-lg border-none">
        <Form
          form={form}
          name="product-form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            sku: generateSKU(),
            barcode: generateBarcode(),
            stockStatus: 'in_stock',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <Form.Item
              name="name"
              label="Product Name"
              rules={[
                { required: true, message: 'Product name is required' },
                {
                  min: 3,
                  message: 'Product name must be at least 3 characters',
                },
              ]}
            >
              <Input
                placeholder="Enter product name"
                className="h-10 rounded-md"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: 'SKU is required' }]}
            >
              <Input
                placeholder="Enter SKU"
                className="h-10 rounded-md"
                suffix={
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => form.setFieldValue('sku', generateSKU())}
                  />
                }
              />
            </Form.Item>

            <Form.Item
              name="barcode"
              label="Barcode"
              rules={[{ required: true, message: 'Barcode is required' }]}
            >
              <Input
                placeholder="Enter Barcode"
                className="h-10 rounded-md"
                prefix={<BarcodeOutlined />}
                suffix={
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      form.setFieldValue('barcode', generateBarcode())
                    }
                  />
                }
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Category is required' }]}
            >
              <Select
                options={
                  Array.isArray(categories?.data)
                    ? categories.data
                        .filter((category: any) => category.status.id === 1)
                        .map((category: any) => ({
                          value: category.id,
                          label: category.name,
                        }))
                    : []
                }
                placeholder="Select category"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item name="brandId" label="Brand">
              <Select
                options={
                  Array.isArray(brandsData?.data)
                    ? brandsData.data
                        .filter((brand: any) => brand.status.id === 1)
                        .map((brand: any) => ({
                          value: brand.id,
                          label: brand.name,
                        }))
                    : []
                }
                placeholder="Select brand (optional)"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Price is required' }]}
            >
              <InputNumber
                className="w-full h-10 rounded-md"
                placeholder="Enter price"
                min={0}
                type="number"
              />
            </Form.Item>

            <Form.Item name="discountPrice" label="Discount Price">
              <InputNumber
                className="w-full h-10 rounded-md"
                placeholder="Enter discount price (optional)"
                min={0}
                type="number"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="totalStock"
              label="Total Stock"
              rules={[
                { required: true, message: 'Total stock is required' },
                { type: 'number', message: 'Total stock must be a number' },
              ]}
            >
              <InputNumber
                className="w-full h-10 rounded-md"
                placeholder="Enter total stock"
                min={0}
                disabled={isStockStatusOutOfStock}
                defaultValue={0}
              />
            </Form.Item>

            <Form.Item
              name="stockStatus"
              label="Stock Status"
              rules={[{ required: true, message: 'Stock status is required' }]}
            >
              <Select
                options={STOCK_STATUS_OPTIONS}
                placeholder="Select stock status"
                className="w-full"
                size="large"
                onChange={handleStockStatusChange}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Form.Item name="tagIds" label="Tags">
              <Select
                mode="multiple"
                options={
                  Array.isArray(tagsData?.data)
                    ? tagsData.data
                        .filter((tag: any) => tag.status.id === 1)
                        .map((tag: any) => ({
                          value: tag.id,
                          label: tag.name,
                        }))
                    : []
                }
                placeholder="Select tags (optional)"
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="w-full"
                size="large"
              />
            </Form.Item>

            {/* <Form.Item name="attributeIds" label="Attributes">
              <Select
                mode="multiple"
                options={
                  Array.isArray(attributes?.data)
                    ? attributes.data
                        .filter((attribute: any) => attribute.status.id === 1)
                        .map((attribute: any) => ({
                          value: attribute.id,
                          label: attribute.internalName,
                        }))
                    : []
                }
                placeholder="Select attributes (optional)"
                className="w-full"
                size="large"
                loading={attributesLoading}
              />
            </Form.Item> */}
          </div>
          <Form.Item name="description" label="Product Description">
            <ReactQuill
              value={form.getFieldValue('description')}
              onChange={(value) => {
                form.setFieldsValue({ description: value });
              }}
              className="h-64 mb-12"
              theme="snow"
              placeholder="Enter product description"
            />
          </Form.Item>

          <div className="!mt-[65px] !md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item name="featureImage" label="Feature Image">
              <MediaSelect
                onChange={(value) =>
                  form.setFieldsValue({ featureImage: value })
                }
                value={form.getFieldValue('featureImage')}
              />
            </Form.Item>

            <Form.Item name="galleryImages" label="Images Gallery">
              <MediaSelect
                multiple
                maxCount={5}
                onChange={(value) =>
                  form.setFieldsValue({ galleryImages: value })
                }
                value={form.getFieldValue('galleryImages')}
              />
            </Form.Item>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate('/products')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setStatus(4);
                form.submit();
              }}
              loading={isSubmitting}
            >
              {id ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setStatus(1);
                form.submit();
              }}
              loading={isSubmitting}
            >
              {id ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProductCreate;
