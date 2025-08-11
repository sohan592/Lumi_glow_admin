import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useGetSingleBrandQuery,
} from '@/modules/appstore/brands/brandsApi';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';
import SubmitButton from '../attributes/components/FormSubmitButton';

const BrandCreate = () => {
  const [form] = Form.useForm();
  const [brandDescription, setBrandDescription] = useState('');
  const { id } = useParams();

  const [status, setStatus] = useState<number | null>(null); // To handle status
  const { id: brandId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Brands', url: '/brands' },
    { title: id ? 'Update Brand' : 'Add Brand' },
  ];

  const { data: brandSingleData } = useGetSingleBrandQuery(brandId, {
    skip: !brandId,
  });

  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();

  useEffect(() => {
    if (brandSingleData) {
      form.setFieldsValue({
        name: brandSingleData.name,
        slug: brandSingleData.slug,
        description: brandSingleData.description,
      });
      setBrandDescription(brandSingleData.description);
    }
  }, [brandSingleData, form]);

  const onFinish = async (values: any) => {
    if (status === null) {
      return message.error('Please select a save option.');
    }

    const formData = {
      ...values,
      description: brandDescription,
      status, // Include the status in the payload
    };

    try {
      if (brandId) {
        // Update existing brand
        await updateBrand({
          id: brandId,
          updatedData: formData,
        }).unwrap();
        message.success('Brand updated successfully');
      } else {
        // Create new brand
        await createBrand(formData).unwrap();
        message.success('Brand created successfully');
      }
      navigate('/products/brands'); // Redirect to the brands list
    } catch (error) {
      message.error('Failed to save brand');
      console.error('Error:', error);
    }
  };

  const handleSaveBrand = () => {
    setStatus(1); // Set status to 1 for "Save Brand"
    form.submit();
  };

  const handleSaveAsDraft = () => {
    setStatus(4); // Set status to 4 for "Save As Draft"
    form.submit();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={brandId ? 'Edit Brand' : 'Add Brand'}
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/products/brands"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSaveBrand}>
              {brandId ? 'Update' : 'Save'} Brand
            </SubmitButton>
          </Space>
        </Form.Item>
      </BreadcrumbHeader>

      <Card
        className="mt-6 shadow-lg rounded-lg border-none"
        bodyStyle={{ padding: '2rem' }}
      >
        <Form
          form={form}
          name="create-brand"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            name="name"
            label={
              <span className="font-semibold text-gray-700">Brand Name</span>
            }
            rules={[{ required: true, message: 'Brand name is required' }]}
          >
            <Input placeholder="Enter brand name" className="h-10 rounded-md" />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <span className="font-semibold text-gray-700">Description</span>
            }
          >
            <Input.TextArea
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              placeholder="Enter brand description"
              rows={4}
            />
          </Form.Item>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate('/products/brands')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveAsDraft}
            >
              {id ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveBrand}
            >
              {id ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default BrandCreate;
