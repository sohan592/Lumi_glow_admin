import { Card, Form, Space, Input, Button, message } from 'antd';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Import hooks from react-router-dom
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';
import SubmitButton from '../attributes/components/FormSubmitButton';
// import Dragger from 'antd/es/upload/Dragger';
import { UploadFile } from 'antd/lib';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetSingleCategoryQuery,
} from '@/modules/appstore/category/categoryApi';
import { id } from 'date-fns/locale';
console.log(InboxOutlined, useLocation);

const parentCategories = [
  { value: 1, label: 'Electronics' },
  { value: 2, label: 'Fashion' },
  { value: 3, label: 'Home Appliances' },
];
console.log(parentCategories);

const CategoryCreate = () => {
  const [form] = Form.useForm();
  const [categoryDescription, setCategoryDescription] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [status, setStatus] = useState<number | null>(null); // State for status
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const { id: paramscatId } = useParams();

  const { data: categorySingeData } = useGetSingleCategoryQuery(paramscatId, {
    skip: !paramscatId,
  });

  console.log(categorySingeData);

  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Categories', url: '/categories' },
    { title: paramscatId ? 'Update Category' : 'Add Category' },
  ];

  useEffect(() => {
    if (categorySingeData) {
      form.setFieldsValue({
        name: categorySingeData.name,
        slug: categorySingeData.slug,
        parent_category: categorySingeData.parent_category || null,
        description: categorySingeData.description,
      });
      setCategoryDescription(categorySingeData.description);
      // If the backend sends image URLs or metadata, map them to the file list structure
      setFileList(
        categorySingeData.images?.map((image: any) => ({
          uid: image.id,
          name: image.name,
          status: 'done',
          url: image.url,
        })) || [],
      );
    }
  }, [categorySingeData, form]);

  const imageUploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', // Mock URL
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileList(info.fileList);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onRemove(file: any) {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };
  console.log(imageUploadProps);

  const onFinish = async (values: any) => {
    if (status === null) {
      return message.error('Please select a save option.');
    }
if (values.name && !values.slug) {
      values.slug = values.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim();
    }
    const formData = {
      ...values,
      description: categoryDescription,
      parent_category: undefined,
      status, // Include the status in the payload
      // images: fileList.map((file) => file.originFileObj), // Adjust based on your backend
    };

    try {
      if (paramscatId) {
        // Update existing category
        await updateCategory({
          id: paramscatId,
          updatedData: formData,
        }).unwrap();
        message.success('Category updated successfully');
      } else {
        // Create new category
        await createCategory(formData).unwrap();
        message.success('Category created successfully');
      }
      navigate('/products/categories'); // Redirect to the categories list
    } catch (error) {
      message.error('Failed to save category');
      console.error('Error:', error);
    }
  };

  const handleSaveCategory = () => {
    setStatus(1); // Set status to 1 for "Save Category"
    form.submit();
  };

  const handleSaveDraft = () => {
    setStatus(4); // Set status to 4 for "Save As Draft"
    form.submit();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={paramscatId ? 'Edit Category' : 'Add Category'}
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/products/categories"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSaveCategory}>
              {paramscatId ? 'Update' : 'Save'} Category
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
          name="create-category"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            name="name"
            label={
              <span className="font-semibold text-gray-700">Category Name</span>
            }
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input
              placeholder="Enter category name"
              className="h-10 rounded-md"
            />
          </Form.Item>

          {/* <Form.Item
              name="parent_category"
              label={
                <span className="font-semibold text-gray-700">
                  Parent Category
                </span>
              }
            >
              <Select
                placeholder="Select parent category"
                className="w-full"
                size="large"
              >
                <Option value={null}>No Parent</Option>
                {parentCategories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}

          <Form.Item
            name="description"
            label={
              <span className="font-semibold text-gray-700">Description</span>
            }
          >
            <Input.TextArea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter category description"
              rows={4}
            />
          </Form.Item>

          {/* <Form.Item
              name="images"
              label={
                <span className="font-semibold text-gray-700">Category Icon</span>
              }
              className="mb-0"
            >
              <Dragger {...imageUploadProps} fileList={fileList} className="h-64">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to upload</p>
                <p className="ant-upload-hint">
                  Support for multiple image uploads. Strictly prohibit uploading
                  company data or other sensitive files
                </p>
              </Dragger>
            </Form.Item> */}

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate('/products/categories')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveDraft}
            >
              {id ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveCategory}
            >
              {id ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryCreate;
