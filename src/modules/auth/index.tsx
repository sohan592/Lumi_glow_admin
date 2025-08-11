import { useSignInMutation } from '@/modules/appstore/Auth/authApi'; // Adjust the path to match your setup
import { LockOutlined } from '@ant-design/icons';
import { RiMailOpenFill } from '@remixicon/react';
import { Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [login, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();

  interface LoginFormValues {
    email: string;
    password: string;
  }

  const onFinish = async (values: LoginFormValues): Promise<void> => {
    try {
      await login(values).unwrap();

      message.success('Login Successful!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: unknown) {
      const errorResponse = error as { data?: { message?: string } };
      message.error(
        errorResponse.data?.message || 'Invalid username or password',
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Illustration Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6a11cb] to-[#2575fc] opacity-80"></div>

        <div className="z-10 text-white text-center">
          <Typography.Title
            style={{ color: 'rgba(255,255,255,0.9)' }}
            level={2}
            className="text-white mb-4"
          >
            Welcome Back
          </Typography.Title>

          <p className="text-white/80 max-w-md mx-auto">
            Secure access to your admin dashboard. Protect your digital
            workspace with our robust authentication system.
          </p>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Typography.Title level={2} className="text-gray-800 mb-2">
              Admin Login
            </Typography.Title>
            <p className="text-gray-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            className="space-y-6"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input
                prefix={<RiMailOpenFill className="text-gray-400" />}
                placeholder="email"
                size="large"
                className="py-3 px-4 rounded-xl"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
                className="py-3 px-4 rounded-xl"
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item>
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full py-3 rounded-xl text-white font-semibold 
                  transition duration-300 ease-in-out
                  ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#6a11cb] to-[#2575fc] hover:from-[#2575fc] hover:to-[#6a11cb]'
                  }
                `}
              >
                {isLoading ? 'Logging In...' : 'Sign In'}
              </button>
            </Form.Item>

            <div className="text-center">
              <a
                href="#"
                className="text-[#6a11cb] hover:text-[#2575fc] hover:underline text-sm"
              >
                Forgot Password?
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
