import ButtonComponent from '@/@components/form/button';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import {
  useCreateShippingMethodMutation,
  useGetSingleShippingMethodQuery,
  useUpdateShippingMethodMutation,
} from '@/modules/appstore/shipping/shippingApi';
import {
  InfoCircleOutlined,
  PlusOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Button, Card, Form, Input, InputNumber, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubmitButton from '../product/attributes/components/FormSubmitButton';

const ShippingForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id: shippingMethodId } = useParams();
  const [status, setStatus] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Shipping Methods', url: '/shipping-methods' },
    {
      title: shippingMethodId
        ? 'Update Shipping Method'
        : 'Add Shipping Method',
    },
  ];

  const { data: shippingMethodData } = useGetSingleShippingMethodQuery(
    shippingMethodId,
    {
      skip: !shippingMethodId,
    },
  );

  const [createShippingMethod] = useCreateShippingMethodMutation();
  const [updateShippingMethod] = useUpdateShippingMethodMutation();

  useEffect(() => {
    if (shippingMethodData) {
      form.setFieldsValue({
        internalName: shippingMethodData.internalName,
        displayName: shippingMethodData.displayName,
        charge: parseInt(shippingMethodData.charge),
        description: shippingMethodData.description,
      });
      setDescription(shippingMethodData.description || '');
    }
  }, [shippingMethodData, form]);

  const onFinish = async (values: any) => {
    if (status === null) {
      return message.error('Please select a save option.');
    }

    const formData = {
      ...values,
      description,
      status,
    };

    try {
      if (shippingMethodId) {
        await updateShippingMethod({
          id: shippingMethodId,
          updatedData: formData,
        }).unwrap();
        message.success('Shipping method updated successfully');
      } else {
        await createShippingMethod(formData).unwrap();
        message.success('Shipping method created successfully');
      }
      navigate('/shipping-methods');
    } catch (error) {
      message.error('Failed to save shipping method');
      console.error('Error:', error);
    }
  };

  const handleSave = () => {
    setStatus(1);
    form.submit();
  };

  const handleSaveAsDraft = () => {
    setStatus(4);
    form.submit();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={
          shippingMethodId ? 'Edit Shipping Method' : 'Add Shipping Method'
        }
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/shipping-methods"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSave}>
              {shippingMethodId ? 'Update' : 'Save'} Shipping Method
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
          name="shipping-form"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            name="internalName"
            label={
              <span className="font-semibold text-gray-700">Internal Name</span>
            }
            rules={[{ required: true, message: 'Internal name is required' }]}
          >
            <Input
              placeholder="standard_shipping"
              className="h-10 rounded-md"
              prefix={<TagOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="displayName"
            label={
              <span className="font-semibold text-gray-700">Display Name</span>
            }
            rules={[{ required: true, message: 'Display name is required' }]}
          >
            <Input
              placeholder="Standard Shipping"
              className="h-10 rounded-md"
              prefix={<InfoCircleOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="charge"
            label={<span className="font-semibold text-gray-700">Charge</span>}
            rules={[
              { required: true, message: 'Charge is required' },
              {
                type: 'number',
                min: 0,
                message: 'Charge must be a positive number',
              },
            ]}
          >
            <InputNumber
              placeholder="50"
              className="h-10 w-full rounded-md"
              min={0}
              prefix="৳"
              value={shippingMethodData?.charge || 0}
              onChange={(value) => {
                form.setFieldsValue({ charge: value });
              }}
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
              }
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <span className="font-semibold text-gray-700">Description</span>
            }
          >
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for the shipping method"
              rows={4}
            />
          </Form.Item>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate('/shipping-methods')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveAsDraft}
            >
              {shippingMethodId ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleSave}>
              {shippingMethodId ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ShippingForm;
