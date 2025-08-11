import { Card, Form, Space } from 'antd';

import ButtonComponent from '@/@components/form/button';
import InputComponent from '@/@components/form/input';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import TextAreaComponent from '@/@components/form/input/textArea';

import SubmitButton from '../components/FormSubmitButton';

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Attributes', url: '/products/attributes' },
  { title: 'Configure Terms', url: '/products/attributes/configure-terms' },
  { title: 'Add New' },
];

const ConfigureTermsCreate = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Submited value: ', values);
    form.resetFields();
    alert('Saved');
  };
  const handleSave = () => {
    form.submit();
  };
  return (
    <div style={{ width: '960px', marginInline: 'auto' }}>
      <BreadcrumbHeader pageTitle="Add New" breadcrumbItems={breadcrumbItems}>
        <Form.Item>
          <Space>
            <ButtonComponent href="/products/attributes/configure-terms">
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSave}>
              Save
            </SubmitButton>
          </Space>
        </Form.Item>
      </BreadcrumbHeader>

      <Card>
        <Form form={form} name="configure-terms" onFinish={onFinish}>
          <Form.Item
            name="term-name"
            validateTrigger="onBlur"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <InputComponent
              inputTitle="Name "
              placeholder="e.g., Red"
              required
            />
          </Form.Item>
          <Form.Item
            name="term-slug"
            validateTrigger="onBlur"
            rules={[{ required: true, message: 'Slug is required' }]}
          >
            <InputComponent
              inputTitle="Slug "
              placeholder="accessories"
              introduction="The slug in the url"
              required
            />
          </Form.Item>
          <Form.Item name="term-description">
            <TextAreaComponent
              rows={3}
              inputTitle="Description"
              introduction="The description is not parmanent"
            />
          </Form.Item>

          {/* 
          // TODO: Color Picker 
          */}
        </Form>
      </Card>
    </div>
  );
};

export default ConfigureTermsCreate;
