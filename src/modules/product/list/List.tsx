import ButtonComponent from '@/@components/form/button';
import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import {
  useBulkProductStatusChangeMutation,
  useDeleteProductsMutation,
  useGetProductsQuery,
} from '@/modules/appstore/product/productsApi';
import sortDropDownData from '@/modules/product/list/sort-dropdown.json';
import tableColumnsListData from '@/modules/product/list/table-columns.json';
import { PlusOutlined } from '@ant-design/icons';
import {
  RiArchiveLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react';
import { Alert, MenuProps, Spin, TableProps } from 'antd';
import { notification, Row } from 'antd';
import { lazy, useState } from 'react';
import NoData from '../components/NoData';
import LeftSideHeader from './left-side-header';
import {
  generateNestedQueryString,
  generateQueryString,
  getSortBy,
} from '@/modules/helpers/utils';
import { useNavigate } from 'react-router-dom';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Products' },
];

export default function ProductList() {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setDataSortOrder] = useState<string | undefined>('DESC');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [productFilters, setProductFilters] = useState<any>({});
  console.log({
    ids,
    keyword,
    sortBy,
    sortOrder,
    currentPage,
    filterStatus,
  });

  const navigate = useNavigate();

  const queryParam = generateNestedQueryString({
    page: currentPage,
    limit: 10,
    filters: {
      name: keyword,
      ...productFilters,
      status:
        productFilters?.status && productFilters.status.length > 0
          ? productFilters.status.map((status: number) => ({
              id: status,
            }))
          : undefined,
    },

    sort: [
      {
        orderBy: getSortBy(sortBy) ?? 'id',
        order: sortOrder,
      },
    ],
  });
  const {
    data: productsData,
    isLoading,
    isError,
  } = useGetProductsQuery(queryParam);

  const [deleteProducts] = useDeleteProductsMutation();
  const [bulkStatusChange] = useBulkProductStatusChangeMutation();

  const handleEditProduct = (data: any) => {
    navigate(`/products/edit/${data?.id}`);
  };

  const handleDeleteProducts = (id: number[]) => {
    const payload = { ids: id };
    const queryString = generateQueryString(payload);

    try {
      deleteProducts(queryString);
      notification.success({ message: 'Product deleted successfully!' });
    } catch (error) {
      notification.error({
        message: 'Failed to delete product',
        description: (error as any).message,
      });
    }
  };

  const handleStatusChange = (id: number[], status: number) => {
    const payload = { ids: id, status };
    const queryString = generateQueryString(payload);

    try {
      bulkStatusChange(queryString);
      notification.success({ message: 'Status changed successfully!' });
    } catch (error) {
      notification.error({
        message: 'Failed to change status',
        description: (error as any).message,
      });
    }
  };

  const sortDropdown: MenuProps['items'] = [
    {
      label: 'Sort By',
      key: '0',
    },
    {
      label: (
        <CustomRadio
          options={sortDropDownData}
          onChange={(e) => setSortBy(e.target.value)}
          setDataSortOrder={setDataSortOrder}
          value={sortBy}
        />
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <Row
          align="middle"
          onClick={() => {
            setSortBy('A-Z');
            setDataSortOrder('ASC');
          }}
        >
          <RiArrowUpLine size={18} />
          <span>A-Z</span>
        </Row>
      ),
      key: '2',
    },
    {
      label: (
        <Row
          align="middle"
          onClick={() => {
            setSortBy('Z-A');
            setDataSortOrder('DESC');
          }}
        >
          <RiArrowDownLine size={18} />
          <span>Z-A</span>
        </Row>
      ),
      key: '3',
    },
  ];

  const tableActions: TableProps<any>['columns'] = [
    {
      title: 'STOCK',
      dataIndex: 'stockStatus',
      render: (stockStatus) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            stockStatus === 'in_stock'
              ? 'bg-green-50 text-green-700 ring-green-600/20'
              : stockStatus === 'out_of_stock'
                ? 'bg-red-50 text-red-700 ring-red-600/20'
                : stockStatus === 'ACTIVE'
                  ? 'bg-green-50 text-green-700 ring-green-600/20'
                  : stockStatus === 'DRAFT'
                    ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                    : 'bg-gray-50 text-gray-700 ring-gray-600/20'
          }`}
        >
          {stockStatus === 'in_stock'
            ? 'IN STOCK'
            : stockStatus === 'out_of_stock'
              ? 'OUT OF STOCK'
              : stockStatus.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'CATEGORY',
      dataIndex: 'category',
      render: (category) => <span>{category?.name}</span>,
    },
    {
      title: 'BRAND',
      dataIndex: 'brand',
      render: (brand) => <span>{brand?.name}</span>,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: (status) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            status?.name === 'ACTIVE'
              ? 'bg-green-50 text-green-700 ring-green-600/20'
              : status?.name === 'DRAFT'
                ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                : 'bg-red-50 text-red-700 ring-red-600/20'
          }`}
        >
          {status?.name}
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'actions',
      render: (data) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button>
            <RiEditLine size={20} onClick={() => handleEditProduct(data)} />
          </button>
          <button>
            <RiDeleteBinLine
              size={20}
              onClick={() => handleDeleteProducts([data?.id])}
            />
          </button>
        </div>
      ),
    },
  ];

  const onSelectionButtons: OnSelectionButton[] = [
    {
      title: 'Delete',
      actionType: 'function',
      action: () => {
        handleDeleteProducts(ids);
      },
      isDefault: true,
    },
    {
      title: 'Set as Active',
      actionType: 'function',
      action: () => {
        handleStatusChange(ids, 1);
      },
      isDefault: true,
    },
    {
      title: 'Set as Draft',
      actionType: 'function',
      action: () => {
        handleStatusChange(ids, 4);
      },
      isDefault: true,
    },
    {
      title: 'Archived',
      actionType: 'function',
      action: () => {
        handleStatusChange(ids, 3);
      },
      icon: <RiArchiveLine size={18} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spin size="large" tip="Loading..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <Alert
          message="Error"
          description="There was an error fetching the data."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbHeader pageTitle="Product" breadcrumbItems={breadcrumbItems}>
        {productsData?.data?.length > 0 && (
          <ButtonComponent
            href="/products/add-product"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Create Product
          </ButtonComponent>
        )}
      </BreadcrumbHeader>

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={[...tableColumnsListData, ...tableActions]}
        dataSource={productsData?.data || []}
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        setFilterStatus={setFilterStatus}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
            buttonLink="/products/add-product"
          />
        }
        totalData={productsData?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        leftHeaderComponent={
          <LeftSideHeader setProductFilters={setProductFilters} />
        }
      />
    </>
  );
}
