import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useCreateTagMutation,
  useUpdateTagMutation,
  useGetSingleTagQuery,
} from '@/modules/appstore/tags/tagsApi';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';
import SubmitButton from '../attributes/components/FormSubmitButton';

const TagCreate = () => {
  const [form] = Form.useForm();
  const [tagDescription, setTagDescription] = useState('');

  const [status, setStatus] = useState<number | null>(null); // To handle status
  const { id: tagId } = useParams();
  const navigate = useNavigate();

  const { data: tagSingleData } = useGetSingleTagQuery(tagId, {
    skip: !tagId,
  });

  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Tags', url: '/tags' },
    { title: tagId ? 'Update Tag' : 'Add Tag' },
  ];

  useEffect(() => {
    if (tagSingleData) {
      form.setFieldsValue({
        name: tagSingleData.name,
        slug: tagSingleData.slug,
        description: tagSingleData.description,
      });
      setTagDescription(tagSingleData.description);
    }
  }, [tagSingleData, form]);

  const onFinish = async (values: any) => {
    if (status === null) {
      return message.error('Please select a save option.');
    }

    const formData = {
      ...values,
      description: tagDescription,
      status, // Include the status in the payload
    };

    try {
      if (tagId) {
        // Update existing tag
        await updateTag({
          id: tagId,
          updatedData: formData,
        }).unwrap();
        message.success('Tag updated successfully');
      } else {
        // Create new tag
        await createTag(formData).unwrap();
        message.success('Tag created successfully');
      }
      navigate('/products/tags'); // Redirect to the tags list
    } catch (error) {
      message.error('Failed to save tag');
      console.error('Error:', error);
    }
  };

  const handleSaveTag = () => {
    setStatus(1); // Set status to 1 for "Save Tag"
    form.submit();
  };

  const handleSaveAsDraft = () => {
    setStatus(4); // Set status to 4 for "Save As Draft"
    form.submit();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={tagId ? 'Edit Tag' : 'Add Tag'}
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/products/tags"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSaveTag}>
              {tagId ? 'Update' : 'Save'} Tag
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
          name="create-tag"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            name="name"
            label={
              <span className="font-semibold text-gray-700">Tag Name</span>
            }
            rules={[{ required: true, message: 'Tag name is required' }]}
          >
            <Input placeholder="Enter tag name" className="h-10 rounded-md" />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <span className="font-semibold text-gray-700">Description</span>
            }
          >
            <Input.TextArea
              value={tagDescription}
              onChange={(e) => setTagDescription(e.target.value)}
              placeholder="Enter tag description"
              rows={4}
            />
          </Form.Item>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate('/products/tags')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveAsDraft}
            >
              {tagId ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveTag}
            >
              {tagId ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TagCreate;
