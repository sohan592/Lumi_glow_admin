import { Card, Form, Space } from 'antd';

import ButtonComponent from '@/@components/form/button';
import InputComponent from '@/@components/form/input';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import SubmitButton from '../attributes/components/FormSubmitButton';

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Size Guidelines', url: '/products/size-guides' },
  { title: 'Add New Size Guidelines' },
];

const SizeGuideCreate = () => {
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
      <BreadcrumbHeader
        pageTitle="Add New Size Guidelines"
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item>
          <Space>
            <ButtonComponent href="/products/size-guides">
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSave}>
              Save
            </SubmitButton>
          </Space>
        </Form.Item>
      </BreadcrumbHeader>

      <Card>
        <Form form={form} name="size-guides" onFinish={onFinish}>
          <Form.Item
            name="size-name"
            validateTrigger="onBlur"
            rules={[{ required: true, message: ' Name is required' }]}
          >
            <InputComponent
              inputTitle="Name "
              placeholder="e.g., Color"
              introduction="The name is how it appears on your site."
              required
            />
          </Form.Item>
          <Form.Item
            name="size-slug"
            validateTrigger="onBlur"
            rules={[{ required: true, message: 'Slug is required' }]}
          >
            <InputComponent
              inputTitle="Slug "
              placeholder="accessories"
              introduction="The “slug” is the URL- friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens."
              required
            />
          </Form.Item>
          {/* 
          // TODO: Text Editor
          // TODO: Size Guide Table
        */}
        </Form>
      </Card>
    </div>
  );
};

export default SizeGuideCreate;
