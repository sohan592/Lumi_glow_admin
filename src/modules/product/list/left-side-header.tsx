import { Button, Form, Select } from 'antd';
import { useGetBrandsQuery } from '@/modules/appstore/brands/brandsApi';
import { useGetCategoryQuery } from '@/modules/appstore/category/categoryApi';

const { Option } = Select;

const LeftSideHeader = ({
  setProductFilters,
}: {
  setProductFilters: React.Dispatch<React.SetStateAction<{}>>;
}) => {
  const [form] = Form.useForm();

  // Fetch data for brands and categories
  const { data: brandsData } = useGetBrandsQuery('');
  const { data: categoriesData } = useGetCategoryQuery('');

  const onFinish = (values: any) => {
    setProductFilters(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('Failed:', errorInfo);
  };

  return (
    <div className="">
      <Form
        initialValues={{
          status: [],
        }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="flex flex-col md:flex-row justify-start items-start md:items-end gap-1 md:gap-6"
      >
        {/* Categories Field */}
        <Form.Item label="Categories" name="categoryId">
          <Select
            options={
              Array.isArray(categoriesData?.data)
                ? categoriesData?.data
                    // .filter((category: any) => category.status.id === 1)
                    .map((category: any) => ({
                      value: category.id,
                      label: category.name,
                    }))
                : []
            }
            mode="multiple"
            placeholder="Select category"
            className="w-full"
            style={{
              width: '200px',
            }}
          />
        </Form.Item>

        {/* Stock Field */}
        <Form.Item label="Stock" name="stockStatus">
          <Select
            placeholder="Choose an option"
            mode="multiple"
            allowClear
            style={{
              width: '200px',
            }}
          >
            <Option value="in_stock">In Stock</Option>
            <Option value="out_of_stock">Out of Stock</Option>
          </Select>
        </Form.Item>

        {/* Brand Field */}
        <Form.Item label="Brand" name="brandId">
          <Select
            options={
              Array.isArray(brandsData?.data)
                ? brandsData.data
                    // .filter((brand: any) => brand.status.id === 1)

                    .map((brand: any) => ({
                      value: brand.id,
                      label: brand.name,
                    }))
                : []
            }
            mode="multiple"
            placeholder="Select brand (optional)"
            className="w-full"
            style={{
              width: '200px',
            }}
          />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            options={[
              { value: 1, label: 'Active' },
              { value: 4, label: 'Draft' },
            ]}
            mode="multiple"
            placeholder="Select status"
            className="w-full"
            style={{
              width: '200px',
            }}
          />
        </Form.Item>

        {/* Submit and Reset Buttons */}
        <div className="flex gap-3">
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Filter
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              block
              onClick={() => {
                form.resetFields();
                setProductFilters({});
              }}
            >
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default LeftSideHeader;
