import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import {
  useGetLoggedProfileQuery,
  useUpdateLoggedProfileMutation,
} from '@/modules/appstore/admin/adminApi';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import { useEffect, useState } from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Profile' },
  { title: 'Edit Profile' },
];

const Profile = ({ profileId }: { profileId?: string }) => {
  const [form] = Form.useForm();
  const [status, setStatus] = useState<number | null>(null);

  // Fetch profile data
  const { data: profileData } = useGetLoggedProfileQuery('');
  const [updateProfile] = useUpdateLoggedProfileMutation();

  useEffect(() => {
    if (profileData) {
      form.setFieldsValue({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      });
    }
  }, [profileData, form]);

  const onFinish = async (values: any) => {
    if (status === null) {
      return message.error('Please select a save option.');
    }

    const updatedProfileData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      status,
    };

    try {
      await updateProfile({
        id: profileId,
        updatedData: updatedProfileData,
      }).unwrap();
      message.success(
        `Profile ${status === 4 ? 'drafted' : 'updated'} successfully`,
      );
      form.resetFields();
    } catch (error) {
      message.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleSaveSettings = () => {
    setStatus(1);
    form.submit();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle="Edit Profile"
        breadcrumbItems={breadcrumbItems}
      >
        {/* <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <Button
              type="primary"
              onClick={handleSaveSettings}
              icon={<PlusOutlined />}
              form="profile_edit"
            >
              Save Changes
            </Button>
          </Space>
        </Form.Item> */}
      </BreadcrumbHeader>

      <Card
        className="mt-6 shadow-lg rounded-lg border-none"
        bodyStyle={{ padding: '2rem' }}
      >
        <Form
          form={form}
          name="profile_edit"
          onFinish={onFinish}
          layout="vertical"
        >
          {/* Grid Layout for the Form Fields */}
          <Row gutter={16}>
            {/* First Name */}
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input placeholder="First Name" className="h-10" />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input placeholder="Last Name" className="h-10" />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Email is required' }]}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-10"
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              href="/"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              onClick={handleSaveSettings}
              icon={<PlusOutlined />}
            >
              Update
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
