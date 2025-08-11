import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import {
  CalendarOutlined,
  DollarOutlined,
  FolderOutlined,
  InfoCircleOutlined,
  PercentageOutlined,
  PlusOutlined,
  ShoppingOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Tooltip,
} from 'antd';
import SubmitButton from '../product/attributes/components/FormSubmitButton';
import { useGetCategoryQuery } from '@/modules/appstore/category/categoryApi';
import { useGetProductsQuery } from '@/modules/appstore/product/productsApi';
import { useEffect, useState } from 'react';
import { generateNestedQueryString } from '../helpers/utils';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCreateCouponMutation,
  useGetSingleCouponQuery,
  useUpdateCouponMutation,
} from '../appstore/coupon/couponApi';
import ButtonComponent from '@/@components/form/button';
import dayjs from 'dayjs';

const CouponForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [productSearch, setProductSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: couponData } = useGetSingleCouponQuery(id || '', {
    skip: !id,
  });
  const [status, setStatus] = useState<number | null>(null);
  const [discountValue, setDiscountValue] = useState<boolean>(false);

  const [createCoupon] = useCreateCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();
  const handleSave = () => {
    form.submit();
  };
  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Coupons', url: '/coupons' },
    { title: id ? 'Update Coupon' : 'Add Coupon' },
  ];

  const filterPayload = {
    page: 1,
    limit: 50,
    filters: {
      name: categorySearch,
      status: { id: 1 },
    },
    sort: [
      {
        orderBy: 'id',
        order: 'DESC',
      },
    ],
  };
  const queryParamProduct = generateNestedQueryString({
    ...filterPayload,
    filters: {
      ...filterPayload.filters,
      name: productSearch,
    },
  });
  const queryParam = generateNestedQueryString(filterPayload);
  const { data: products } = useGetProductsQuery(queryParamProduct);
  const { data: categories } = useGetCategoryQuery(queryParam);

  useEffect(() => {
    if (couponData) {
      form.setFieldsValue({
        campaignName: couponData.campaignName,
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: parseFloat(couponData.discountValue),
        maxUses: couponData.maxUses,
        maxUsesPerUser: couponData.maxUsesPerUser,
        minOrderAmount: couponData?.minOrderAmount
          ? parseInt(couponData.minOrderAmount)
          : undefined,
        maxDiscountAmount: couponData?.maxDiscountAmount
          ? parseInt(couponData?.maxDiscountAmount)
          : undefined,
        startDate: couponData.startDate ? dayjs(couponData.startDate) : null,
        endDate: couponData.endDate ? dayjs(couponData.endDate) : null,
        status: couponData.status,
        description: couponData.description || '',
        productsId: couponData?.productIds,
        categoryId: couponData?.categoryIds,
      });
    }
  }, [couponData, form]);

  const onFinish = async (values: any) => {
    try {
      setIsSubmitting(true);
      if (id) {
        await updateCoupon({ id, updatedData: { ...values, status } }).unwrap();
        message.success('Coupon updated successfully');
      } else {
        await createCoupon({ ...values, status }).unwrap();
        message.success('Coupon created successfully');
      }
      navigate('/coupons');
    } catch (error: any) {
      message.error(
        `Failed to ${id ? 'update' : 'create'} coupon: ${error.message}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscountTypeChange = (value: string) => {
    if (value === 'fixed') {
      form.setFieldValue('discountValue', null);
    }
    setDiscountValue(value === 'fixed');
  };

  return (
    <div className="w-full max-w-7xl mx-auto  bg-white p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={id ? 'Update Coupon' : 'Add Coupon'}
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/coupons"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSave}>
              {id ? 'Update Coupon' : 'Create Coupon'}
            </SubmitButton>
          </Space>
        </Form.Item>
      </BreadcrumbHeader>

      <Card className="mt-6 shadow-lg rounded-lg border-none">
        <Form
          form={form}
          name="coupon-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              name="campaignName"
              label={
                <span className="font-semibold text-gray-700">
                  Campaign Name
                </span>
              }
              validateTrigger="onBlur"
              rules={[{ required: true, message: 'Campaign name is required' }]}
            >
              <Input
                placeholder="Enter campaign name"
                className="h-10 rounded-md"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Code */}
            <Form.Item
              name="code"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <TagOutlined className="mr-2 text-blue-500" />
                  Coupon Code
                </span>
              }
              rules={[{ required: true, message: 'Coupon code is required' }]}
            >
              <Input
                placeholder="SUMMER2024"
                className="rounded-md h-10"
                prefix={<TagOutlined className="text-gray-400" />}
              />
            </Form.Item>

            {/* Discount Type */}
            <Form.Item
              name="discountType"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <PercentageOutlined className="mr-2 text-green-500" />
                  Discount Type
                </span>
              }
              rules={[{ required: true, message: 'Discount type is required' }]}
            >
              <Select
                placeholder="Select discount type"
                className="rounded-md h-10"
                onChange={handleDiscountTypeChange}
              >
                <Select.Option value="percentage">
                  Percentage Discount
                </Select.Option>
                <Select.Option value="fixed">
                  Fixed Amount Discount
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Discount Value */}
            <Form.Item
              name="discountValue"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <DollarOutlined className="mr-2 text-purple-500" />
                  Discount Value
                </span>
              }
              rules={[
                { required: true, message: 'Discount value is required' },
                {
                  validator: (_, value) => {
                    const discountType = form.getFieldValue('discountType');
                    if (discountType === 'percentage' && value > 100) {
                      return Promise.reject(
                        new Error(
                          'Discount value must be less than or equal to 100',
                        ),
                      );
                    }
                    if (
                      value !== undefined &&
                      value.toString().includes('.') &&
                      value.toString().split('.')[1].length > 2
                    ) {
                      return Promise.reject(
                        new Error('Only up to 2 decimal places are allowed'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                placeholder="10"
                className="rounded-md h-10 w-full"
                min={0}
                step={0.01}
                disabled={discountValue}
              />
            </Form.Item>

            {/* Start Date */}
            <Form.Item
              name="startDate"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <CalendarOutlined className="mr-2 text-orange-500" />
                  Start Date
                </span>
              }
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <DatePicker
                className="rounded-md h-10 w-full"
                format="YYYY-MM-DD"
                placeholder="Start Date"
              />
            </Form.Item>

            {/* End Date */}
            <Form.Item
              name="endDate"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <CalendarOutlined className="mr-2 text-red-500" />
                  End Date
                </span>
              }
              rules={[{ required: true, message: 'End date is required' }]}
            >
              <DatePicker
                className="rounded-md h-10 w-full"
                format="YYYY-MM-DD"
                placeholder="End Date"
              />
            </Form.Item>
          </div>
          {form.getFieldValue('discountType') === 'percentage' && (
            <Form.Item
              name="maxDiscountAmount"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <DollarOutlined className="mr-2 text-purple-500" />
                  Maximum Discount Amount
                </span>
              }
              rules={[
                {
                  validator: (_, value) => {
                    if (
                      value !== undefined &&
                      value.toString().includes('.') &&
                      value.toString().split('.')[1].length > 2
                    ) {
                      return Promise.reject(
                        new Error('Only up to 2 decimal places are allowed'),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                placeholder="No limit"
                className="rounded-md h-10 w-full"
                min={0}
                step={0.01}
              />
            </Form.Item>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Usage Limit */}
            <Form.Item
              name="maxUses"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <Tooltip title="Maximum number of times this coupon can be used">
                    <InfoCircleOutlined className="mr-2 text-blue-400" />
                  </Tooltip>
                  Total Usage Limit
                </span>
              }
            >
              <InputNumber
                placeholder="Unlimited"
                className="rounded-md h-10 w-full"
                min={0}
                step={1}
                parser={(value) => parseInt(value || '0', 10)}
              />
            </Form.Item>

            {/* Usage Per Customer */}
            <Form.Item
              name="maxUsesPerUser"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <Tooltip title="Maximum uses per individual customer">
                    <InfoCircleOutlined className="mr-2 text-green-400" />
                  </Tooltip>
                  Usage Per Customer
                </span>
              }
            >
              <InputNumber
                placeholder="Unlimited"
                className="rounded-md h-10 w-full"
                min={0}
                parser={(value) => parseInt(value || '0', 10)}
              />
            </Form.Item>

            {/* Minimum Order Value */}
            <Form.Item
              name="minOrderAmount"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <DollarOutlined className="mr-2 text-indigo-500" />
                  Minimum Order Value
                </span>
              }
            >
              <InputNumber
                placeholder="No minimum"
                className="rounded-md h-10 w-full"
                min={0}
                step={0.01}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Applicable Products */}
            <Form.Item
              name="productsId"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <ShoppingOutlined className="mr-2 text-blue-500" />
                  Applicable Products
                </span>
              }
            >
              <Select
                showSearch
                options={
                  Array.isArray(products?.data)
                    ? products.data
                        .filter((product: any) => product.status.id === 1)
                        .map((products: any) => ({
                          value: products.id,
                          label: products.name,
                        }))
                    : []
                }
                value={form.getFieldValue('productsId')}
                placeholder="Select products"
                className="w-full"
                size="large"
                filterOption={false}
                onSearch={(value) => {
                  setProductSearch(value);
                }}
                mode="multiple"
                defaultActiveFirstOption={false}
                notFoundContent={null}
              />
            </Form.Item>

            {/* Applicable Categories */}
            <Form.Item
              name="categoryId"
              label={
                <span className="flex items-center text-gray-700 font-semibold">
                  <FolderOutlined className="mr-2 text-green-500" />
                  Applicable Categories
                </span>
              }
            >
              <Select
                showSearch
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
                value={form.getFieldValue('categoryId')}
                mode="multiple"
                placeholder="Select category"
                className="w-full"
                size="large"
                filterOption={false}
                onSearch={(value) => {
                  setCategorySearch(value);
                }}
                defaultActiveFirstOption={false}
                notFoundContent={null}
              />
            </Form.Item>
          </div>

          {/* Description */}
          <Form.Item
            name="description"
            label={
              <span className="text-gray-700 font-semibold">
                Coupon Description
              </span>
            }
          >
            <Input.TextArea
              placeholder="Add a brief description of the coupon"
              className="rounded-md"
              rows={3}
            />
          </Form.Item>

          {/* Submit Button */}

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              disabled={isSubmitting}
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              href="/coupons"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              disabled={isSubmitting}
              icon={<PlusOutlined />}
              onClick={() => {
                setStatus(4);
                form.submit();
              }}
            >
              {id ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button
              type="primary"
              disabled={isSubmitting}
              icon={<PlusOutlined />}
              onClick={() => {
                setStatus(1);
                form.submit();
              }}
            >
              {id ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CouponForm;
