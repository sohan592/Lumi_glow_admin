import { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Space,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';

const { Option } = Select;

const CustomersForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [statusId, setStatusId] = useState<number | null>(null);

  interface FieldData {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    rules: {
      required?: boolean;
      message: string;
      type?: 'email' | 'string' | 'number';
    }[];
    options?: { value: string; label: string }[];
  }

  const fieldData: FieldData[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'input',
      placeholder: 'Enter first name',
      rules: [{ required: true, message: 'First name is required' }],
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'input',
      placeholder: 'Enter last name',
      rules: [{ required: true, message: 'Last name is required' }],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'input',
      placeholder: 'Enter email',
      rules: [
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Please enter a valid email' },
      ],
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      rules: [{ required: true, message: 'Password is required' }],
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      placeholder: 'Select a role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ],
      rules: [{ required: true, message: 'Role is required' }],
    },
  ];

  const onFinish = (values: any) => {
    if (statusId === null) {
      return message.error('Please select a save option.');
    }

    const dataToSave = {
      ...values,
      id: statusId,
    };

    console.log('Saving data:', dataToSave);
    message.success(
      `Customer ${statusId === 4 ? 'saved as draft' : 'saved successfully'}!`,
    );
    navigate('/customers');
  };

  const handleSave = () => {
    const role = form.getFieldValue('role');
    if (role === 'admin') {
      setStatusId(1);
    } else if (role === 'user') {
      setStatusId(2);
    }
    form.submit();
  };

  const handleSaveAsDraft = () => {
    setStatusId(4);
    form.submit();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle="Add Customer"
        breadcrumbItems={[
          { title: 'Dashboard', url: '/' },
          { title: 'Customers', url: '/customers' },
          { title: 'Add Customer' },
        ]}
      >
        <Form.Item className="mb-0">
          <Space size="middle">
            <ButtonComponent
              href="/customers"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <ButtonComponent
              href="/customers"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Save Customer
            </ButtonComponent>
          </Space>
        </Form.Item>
      </BreadcrumbHeader>

      <Card
        className="mt-6 shadow-lg rounded-lg border-none"
        bodyStyle={{ padding: '2rem' }}
      >
        <Form
          form={form}
          name="customer-form"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={24}>
            {fieldData.map((field) => (
              <Col xs={24} lg={12} key={field.name}>
                <Form.Item
                  name={field.name}
                  label={field.label}
                  rules={field.rules}
                >
                  {field.type === 'input' ? (
                    <Input
                      placeholder={field.placeholder}
                      className="h-10 rounded-md"
                    />
                  ) : field.type === 'password' ? (
                    <Input.Password
                      placeholder={field.placeholder}
                      className="h-10 rounded-md"
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      placeholder={field.placeholder}
                      className="h-10 rounded-md"
                    >
                      {field.options?.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  ) : null}
                </Form.Item>
              </Col>
            ))}
          </Row>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate('/customers')}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
            <Button type="primary" onClick={handleSave}>
              Save Customer
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CustomersForm;
