import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  message,
  Space,
  InputRef,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import ButtonComponent from '@/@components/form/button';
import SubmitButton from './components/FormSubmitButton';
import {
  useCreateAttributeMutation,
  useGetSingleAttributeQuery,
  useUpdateAttributeMutation,
} from '@/modules/appstore/attribute/attributeApi';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RiDragMove2Line as DragHandleIcon } from '@remixicon/react';

const { Option } = Select;

const statusOptions = [
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'string', label: 'String' },
];

const AttributeCreate = () => {
  const [form] = Form.useForm();
  const [attributeOptions, setAttributeOptions] = useState<
    { id: string; value: string }[]
  >([]);
  const [newOption, setNewOption] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const inputRef = useRef<InputRef>(null);
  const { id: attributeId } = useParams();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Attributes', url: '/attributes' },
    { title: attributeId ? 'Update Attribute' : 'Add Attribute' },
  ];

  // API hooks for mutation and query
  const [createAttribute] = useCreateAttributeMutation();
  const [updateAttribute] = useUpdateAttributeMutation();
  const { data: attributeSingleData } = useGetSingleAttributeQuery(
    attributeId,
    { skip: !attributeId },
  );

  // Load data for editing
  useEffect(() => {
    if (attributeSingleData) {
      form.setFieldsValue({
        externalName: attributeSingleData.externalName,
        internalName: attributeSingleData.internalName,
        description: attributeSingleData.description,
        type: attributeSingleData.type,
      });
      setAttributeOptions(
        attributeSingleData.values?.map((data: any) => ({
          id: `${Date.now()}-${Math.random()}`,
          value: data?.value,
        })) || [],
      );
    }
  }, [attributeSingleData, form]);

  const onFinish = async (values: any) => {
    if (status === null) {
      return message.error('Please select a save option.');
    }

    const payload = {
      ...values,
      values: attributeOptions.map((option) => ({ value: option.value })),
      status,
    };

    try {
      if (attributeId) {
        await updateAttribute({
          id: attributeId,
          updatedData: payload,
        }).unwrap();
        message.success('Attribute updated successfully');
      } else {
        await createAttribute(payload).unwrap();
        message.success('Attribute created successfully');
      }
      navigate('/products/attributes');
    } catch (error) {
      message.error('Failed to save attribute');
      console.error('Error:', error);
    }
  };

  const handleSave = () => {
    setStatus(1); // Save status
    form.submit();
  };

  const handleSaveAsDraft = () => {
    setStatus(4); // Draft status
    form.submit();
  };

  const addOption = () => {
    if (newOption.trim()) {
      const newId = `${Date.now()}`;
      setAttributeOptions((prev) => [
        ...prev,
        { id: newId, value: newOption.trim() },
      ]);
      setNewOption('');
      inputRef.current?.focus();
    }
  };

  const removeOption = (id: string) => {
    setAttributeOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAttributeOptions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const SortableItem = ({ id, value }: { id: string; value: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <li
        ref={setNodeRef}
        style={style}
        className="group flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            {...attributes}
            {...listeners}
            className="flex items-center cursor-grab"
          >
            <DragHandleIcon className="h-5 w-5 text-gray-400" />
          </span>
          <span className="text-gray-700">{value}</span>
        </div>
        <Button
          type="text"
          danger
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            removeOption(id);
          }}
        >
          Remove
        </Button>
      </li>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-6">
      <BreadcrumbHeader
        pageTitle={attributeId ? 'Edit Attribute' : 'Add Attribute'}
        breadcrumbItems={breadcrumbItems}
      >
        <Form.Item className="mb-0">
          <Space>
            <ButtonComponent
              href="/products/attributes"
              className="text-gray-700 hover:bg-gray-100 border border-gray-300"
            >
              Discard
            </ButtonComponent>
            <SubmitButton form={form} onClick={handleSave}>
              {attributeId ? 'Update' : 'Save'} Attribute
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
          name="create-attribute"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-6"
        >
          <Form.Item
            name="externalName"
            label={
              <span className="font-semibold text-gray-700">Display Name</span>
            }
            rules={[{ required: true, message: 'Display name is required' }]}
          >
            <Input
              placeholder="Enter display name"
              className="h-10 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="internalName"
            label={
              <span className="font-semibold text-gray-700">Internal Name</span>
            }
            rules={[{ required: true, message: 'Internal name is required' }]}
          >
            <Input
              placeholder="Enter internal name"
              className="h-10 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <span className="font-semibold text-gray-700">Description</span>
            }
          >
            <Input.TextArea
              placeholder="Enter attribute description"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={
              <span className="font-semibold text-gray-700">
                Attribute Type
              </span>
            }
            rules={[{ required: true, message: 'Attribute type is required' }]}
          >
            <Select
              placeholder="Select attribute type"
              className="w-full"
              size="large"
            >
              {statusOptions.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Attribute Options
              </label>
              <div className="flex gap-4">
                <Input
                  ref={inputRef}
                  placeholder="Enter option value"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="h-11 rounded-lg border-gray-300"
                  onPressEnter={addOption}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addOption}
                  className="h-11 px-6"
                  disabled={!newOption.trim()}
                >
                  Add Option
                </Button>
              </div>
            </div>

            {attributeOptions.length > 0 && (
              <DndContext onDragEnd={handleDragEnd}>
                <SortableContext
                  items={attributeOptions.map((option) => option.id)}
                >
                  <ul className="space-y-3">
                    {attributeOptions.map((option) => (
                      <SortableItem
                        key={option.id}
                        id={option.id}
                        value={option.value}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="default"
              href="/products/attributes"
              className="text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleSaveAsDraft}
            >
              {attributeId ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleSave}>
              {attributeId ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AttributeCreate;
