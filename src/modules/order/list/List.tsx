import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import { useGetOrdersQuery } from '@/modules/appstore/orders/ordersAPI';
import SortDropDownData from '@/modules/order/list/sort-dropdown.json';
import NoData from '@/modules/product/components/NoData';
import {
  RiArchiveLine,
  RiArrowDownLine,
  RiArrowUpLine,
  RiEyeLine,
} from '@remixicon/react';
import type { MenuProps, TableProps } from 'antd';
import { Alert, Row, Spin } from 'antd';

import { lazy, useState } from 'react';

import {
  generateNestedQueryString,
  getSortByOrder,
} from '@/modules/helpers/utils';
import LeftSideHeader from '@/modules/order/list/left-side-header';
import { Link } from 'react-router-dom';
const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

export default function OrderList() {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setDataSortOrder] = useState<string | undefined>('DESC');
  const [orderFilters, setorderFilters] = useState<{
    status?: number[];
    statusId?: number;
    userId?: string;
    // categoryId?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    paymentStartDate?: string;
    paymentEndDate?: string;
    customerName?: string;
    customerEmail?: string;
    location?: string;
    productIds?: number[];
  }>({});

  console.log({
    ids,
    keyword,
    sortBy,
    currentPage,
    orderFilters,
  });

  const validOrderFilters = {
    ...orderFilters,
    userId: orderFilters.userId ? Number(orderFilters.userId) : undefined,
    statusId: orderFilters.statusId ? Number(orderFilters.statusId) : undefined,
    // categoryId: orderFilters.categoryId
    //   ? Number(orderFilters.categoryId)
    //   : undefined,
    paymentStatus: orderFilters.paymentStatus || undefined,
    startDate: orderFilters.startDate,
    endDate: orderFilters.endDate,
    paymentStartDate: orderFilters.paymentStartDate,
    paymentEndDate: orderFilters.paymentEndDate,
    customerEmail: orderFilters.customerEmail,
    location: orderFilters.location,
    productIds: orderFilters.productIds?.map(Number),
  };

  const queryParam = generateNestedQueryString({
    page: currentPage,
    limit: 10,
    filters: {
      customerName: keyword,
      ...validOrderFilters,
    },
    sort: [
      {
        orderBy: getSortByOrder(sortBy) ?? 'id',
        order: sortOrder,
      },
    ],
  });
  console.log('queryParam ', queryParam);
  const { data: orderData, isLoading, isError } = useGetOrdersQuery(queryParam);

  const sortDropdown: MenuProps['items'] = [
    {
      label: 'Sort By',
      key: '0',
    },
    {
      label: (
        <CustomRadio
          options={SortDropDownData}
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
      title: 'Order ID',
      dataIndex: 'id',
    },
    {
      title: 'Customers Name',
      dataIndex: 'billingAddress',
      render: (billingAddress) => `${billingAddress?.fullName}`.toUpperCase(),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      render: (paymentMethod) => paymentMethod?.toUpperCase() || 'N/A',
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            paymentStatus?.toLowerCase() === 'paid'
              ? 'bg-green-100 text-green-800 ring-green-700/30'
              : paymentStatus?.toLowerCase() === 'failed'
                ? 'bg-red-100 text-red-800 ring-red-700/30'
                : paymentStatus?.toLowerCase() === 'refunded'
                  ? 'bg-yellow-100 text-yellow-800 ring-yellow-700/30'
                  : 'bg-gray-100 text-gray-800 ring-gray-700/30'
          }`}
        >
          {paymentStatus?.toUpperCase() || 'PENDING'}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'total',
      render: (total) => `৳ ${total}`,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'Phone',
      dataIndex: 'shippingAddress',
      render: (shippingAddress) => shippingAddress?.phoneNumber || 'N/A',
    },
    {
      title: 'Address',
      dataIndex: 'billingAddress',
      render: (billingAddress) =>
        `${billingAddress?.addressLine1.toUpperCase()}, ${billingAddress?.region.toUpperCase()}` ||
        'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
            status?.name === 'ACTIVE'
              ? 'bg-green-50 text-green-700 ring-green-600/20'
              : status?.name === 'PROCESSING'
                ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                : status?.name === 'RECEIVED'
                  ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                  : status?.name === 'CANCELED'
                    ? 'bg-red-50 text-red-700 ring-red-600/20'
                    : status?.name === 'REFUNDED'
                      ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                      : status?.name === 'DELIVERED'
                        ? 'bg-green-100 text-green-800 ring-green-700/20'
                        : 'bg-gray-50 text-gray-700 ring-gray-600/20'
          }`}
        >
          {status?.name}
        </span>
      ),
    },
    {
      title: 'View',
      dataIndex: '',
      key: 'view',
      render: (data) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/orders/${data?.id}`}>
            <RiEyeLine size={20} className="cursor-pointer" />
          </Link>
        </div>
      ),
    },
  ];

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Orders' },
  ];

  const publishItem = () => {
    alert('Item published successfully');
  };

  const deleteItem = () => {
    alert('Deleted successfully');
  };

  const archiveItem = () => {
    alert('Archived successfully');
  };

  const onSelectionButtons: OnSelectionButton[] = [
    {
      title: 'Delete',
      actionType: 'function',
      action: deleteItem,
      isDefault: true,
    },
    {
      title: 'Set as Active',
      actionType: 'function',
      action: publishItem,
      isDefault: true,
    },
    {
      title: 'Set as Draft',
      actionType: 'function',
      action: publishItem,
      isDefault: true,
    },

    {
      title: 'Archived',
      actionType: 'function',
      action: archiveItem,
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
      <BreadcrumbHeader pageTitle="Orders" breadcrumbItems={breadcrumbItems} />

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={[...tableActions]}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
            buttonLink="/products/category/new"
          />
        }
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        totalData={orderData?.total || 0}
        currentPage={currentPage}
        dataSource={orderData?.data || []}
        setCurrentPage={setCurrentPage}
        leftHeaderComponent={
          <LeftSideHeader setOrderFilters={setorderFilters} />
        }
      />
    </>
  );
}
