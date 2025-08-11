import { Card, Table, Tag } from 'antd';

import { useGetSingleCustomerQuery } from '@/modules/appstore/customer/customerApi';
import { useGetUserOrdersQuery } from '@/modules/appstore/orders/ordersAPI';
import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import { TableProps } from 'antd/lib';
import { RiEyeLine } from '@remixicon/react';
import { useState } from 'react';

const CustomerView = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch customer details
  const { data: customerData } = useGetSingleCustomerQuery(id);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetUserOrdersQuery({
    id,
    limit,
    page: currentPage,
  });

  const tableActions: TableProps<any>['columns'] = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
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
            paymentStatus === 'paid'
              ? 'bg-green-50 text-green-700 ring-green-600/20'
              : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
          }`}
        >
          {paymentStatus.toUpperCase() || 'PENDING'}
        </span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'total',
      render: (total) => {
        return <span>৳ {total}</span>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (createdAt) => moment(createdAt).format('MMMM D, YYYY'),
    },
    {
      title: 'Phone',
      dataIndex: 'shippingAddress',
      render: (shippingAddress) => shippingAddress?.phoneNumber || 'N/A',
    },

    {
      title: 'Address',
      dataIndex: 'billingAddress',
      render: (billingAddress) => {
        return (
          <div>
            <p>{billingAddress?.addressLine1}</p>
            <p>{billingAddress?.region}</p>
          </div>
        );
      },
    },
    {
      title: 'Status',
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
          <Link to={`/orders/${data?.id}`}>
            <RiEyeLine size={20} className="cursor-pointer" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Customer Profile
        </h1>
        <p className="text-gray-500">ID: #{customerData?.id}</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {customerData?.firstName} {customerData?.lastName}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Member since{' '}
              {moment(customerData?.createdAt).format('MMMM D, YYYY')}
            </p>
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="py-6">
        <h2 className="text-xl font-semibold mb-4">Addresses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerData?.addresses.map((address: any) => (
            <Card
              key={address.id}
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Tag
                    color={address.type === 'home' ? 'blue' : 'orange'}
                    icon={
                      address.type === 'home' ? (
                        <HomeOutlined />
                      ) : (
                        <ShopOutlined />
                      )
                    }
                  >
                    {address.type.charAt(0).toUpperCase() +
                      address.type.slice(1)}
                  </Tag>
                  {address.isDefaultShipping && (
                    <Tag color="green" className="ml-2">
                      Default Shipping
                    </Tag>
                  )}
                  {address.isDefaultBilling && (
                    <Tag color="purple" className="ml-2">
                      Default Billing
                    </Tag>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">
                  {address.fullName}
                </h3>

                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    <HomeOutlined className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-600">{address.addressLine1}</p>
                    {address.addressLine2 && (
                      <p className="text-gray-600">{address.addressLine2}</p>
                    )}
                    <p className="text-gray-600">{address.region}</p>
                    {address.landmark && (
                      <p className="text-gray-500 text-sm">
                        Landmark: {address.landmark}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <PhoneOutlined className="text-gray-400" />
                  <p className="text-gray-600">{address.phoneNumber}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <MailOutlined className="text-gray-400" />
                  <p className="text-gray-600">{address.email}</p>
                </div>

                {address.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Notes: {address.notes}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        {customerData?.addresses.length === 0 && (
          <div className="bg-white shadow-md rounded-lg p-4 mt-4">
            <p className="text-gray-500 text-center">No address found</p>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="py-6">
        <h2 className="text-xl font-semibold mb-4">Order List</h2>
        {isOrdersLoading ? (
          <p>Loading orders...</p>
        ) : isOrdersError ? (
          <p>Failed to load orders.</p>
        ) : (
          <Table
            columns={[...tableActions]}
            dataSource={ordersData?.data || []}
            pagination={{
              current: currentPage,
              total: ordersData?.total || 0,
              pageSize: limit,
              onChange: (page) => {
                setCurrentPage(page);
              },
              size: 'small',
              style: {
                display: 'flex',
                gap: 'var(--gap-xs)',
              },
            }}
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
};

export default CustomerView;
