import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import {
  useGetLoggedProfileQuery,
  useUpdateLoggedProfileMutation,
} from '@/modules/appstore/admin/adminApi';
import { LockOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Settings' },
  { title: 'Change Password' },
];

const Setting = () => {
  const [form] = Form.useForm();
  const { data: profileData } = useGetLoggedProfileQuery('');
  const [forgotPassword, { isLoading }] = useUpdateLoggedProfileMutation();

  const onFinish = async (values: any) => {
    const { oldPassword, newPassword } = values;

    const payload = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      oldPassword,
      password: newPassword,
    };

    try {
      await forgotPassword({ updatedData: payload }).unwrap();
      message.success('Password reset successful!');
      form.resetFields();
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle="Forgot Password"
        breadcrumbItems={breadcrumbItems}
      ></BreadcrumbHeader>

      {/* Card with Form */}
      <Card
        className="mt-6 shadow-lg rounded-lg border-none"
        bodyStyle={{ padding: '2rem' }}
      >
        <Form
          form={form}
          name="forgot_password_form"
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Old Password */}
            <Form.Item
              name="oldPassword"
              label={
                <span className="font-semibold text-gray-700">
                  Old Password
                </span>
              }
              rules={[
                { required: true, message: 'Please input your old password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Old Password"
                style={{ height: '40px' }}
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item
              name="newPassword"
              label={
                <span className="font-semibold text-gray-700">
                  New Password
                </span>
              }
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 8, message: 'Password must be at least 8 characters' },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/,
                  message:
                    'Password must contain uppercase, lowercase, number and special character',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="New Password"
                style={{ height: '40px' }}
              />
            </Form.Item>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row justify-end gap-2 mt-6">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              href="/"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              {isLoading ? 'Processing...' : 'Update'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Setting;
