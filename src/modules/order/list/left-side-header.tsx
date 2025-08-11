import { Button, Form, Input, Select, DatePicker, Modal } from 'antd';
import { useState } from 'react';
import { useGetCategoryQuery } from '@/modules/appstore/category/categoryApi';

const { RangePicker } = DatePicker;

const FilterModal = ({
  visible,
  onClose,
  onApplyFilters,
}: {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}) => {
  const [form] = Form.useForm();

  // Fetch data for categories
  const { data: categoriesData } = useGetCategoryQuery('');
  console.log(categoriesData);

  const handleApply = () => {
    form.validateFields().then((values) => {
      const { dateRange, paymentDateRange, ...restValues } = values;

      const filters = {
        ...restValues,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD') || null,
        endDate: dateRange?.[1]?.format('YYYY-MM-DD') || null,
        paymentStartDate: paymentDateRange?.[0]?.format('YYYY-MM-DD') || null,
        paymentEndDate: paymentDateRange?.[1]?.format('YYYY-MM-DD') || null,
      };

      onApplyFilters(filters);
      onClose();
    });
  };

  const handleReset = () => {
    form.resetFields();
    onApplyFilters({});
  };

  return (
    <Modal
      title="Filter Products"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Reset
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {/* Categories Field */}
        {/* <Form.Item label="Categories" name="categoryId">
          <Select
            options={
              Array.isArray(categoriesData?.data)
                ? categoriesData?.data.map((category: any) => ({
                    value: category.id,
                    label: category.name,
                  }))
                : []
            }
            mode="multiple"
            placeholder="Select category"
          />
        </Form.Item> */}

        {/* Date Filter Field */}
        <Form.Item label="Date Filter (Start/End)" name="dateRange">
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Payment Date Filter Field */}
        <Form.Item label="Payment Date Filter" name="paymentDateRange">
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Status Field */}
        <Form.Item label="Status" name="status">
          <Select
            options={[
              { value: 5, label: 'Processing' },
              { value: 6, label: 'Received' },
              { value: 7, label: 'Canceled' },
              { value: 8, label: 'Refunded' },
              { value: 9, label: 'Delivered' },
            ]}
            placeholder="Select status"
          />
        </Form.Item>

        {/* User ID Field */}
        <Form.Item label="User ID" name="userId">
          <Input placeholder="Enter user ID" />
        </Form.Item>

        {/* Payment Status Field */}
        <Form.Item label="Payment Status" name="paymentStatus">
          <Select
            options={[
              { value: 'paid', label: 'PAID' },
              { value: 'failed', label: 'FAILED' },
              { value: 'pending', label: 'PENDING' },
              { value: 'refunded', label: 'REFUNDED' },
            ]}
            placeholder="Select payment status"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const LeftSideHeader = ({
  setOrderFilters,
}: {
  setOrderFilters: React.Dispatch<React.SetStateAction<{}>>;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleApplyFilters = (newFilters: any) => {
    setOrderFilters(newFilters);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Open Filters
      </Button>

      <FilterModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default LeftSideHeader;
