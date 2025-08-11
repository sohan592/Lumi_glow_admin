import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import {
  useBulkCustomerStatusChangeMutation,
  useGetCustomersQuery,
} from '@/modules/appstore/customer/customerApi';
import SortDropDownData from '@/modules/customers/list/sort-dropdown.json';
import {
  generateNestedQueryString,
  generateQueryString,
  getSortBy,
  getStatusNumber,
} from '@/modules/helpers/utils';
import NoData from '@/modules/product/components/NoData';
import { RiArchiveLine, RiEyeLine } from '@remixicon/react';
import type { MenuProps, TableProps } from 'antd';
import { Alert, Button, notification, Spin } from 'antd';
import { lazy, useState } from 'react';
import { Link } from 'react-router-dom';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const CustomerList = () => {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | undefined>('DESC');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<string | null>('All');

  const queryParam = generateNestedQueryString({
    page: currentPage,
    limit: 10,
    filters: {
      keyword: keyword,
      status:
        filterStatus && filterStatus !== 'All'
          ? [{ id: getStatusNumber(filterStatus) }]
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
    data: customers,
    isError,
    isLoading,
    isFetching,
  } = useGetCustomersQuery(queryParam);
  const [bulkStatusChange] = useBulkCustomerStatusChangeMutation();

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

  const tableActions: TableProps<any>['columns'] = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2">
            <img
              src={
                record?.photo
                  ? `https://v2.worldunihub.com/api/v1/media/single/${record?.photo}`
                  : 'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg'
              }
              alt={record?.firstName}
              className="w-8 h-8 rounded-full"
            />
            <span>
              {record?.firstName} {record?.lastName}
            </span>
          </div>
        );
      },
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              status?.name === 'ACTIVE'
                ? 'bg-green-50 text-green-700 ring-green-600/20'
                : status?.name === 'INACTIVE'
                  ? 'bg-red-50 text-red-700 ring-red-600/20'
                  : 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
            }`}
          >
            {status?.name}
          </span>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'actions',
      render: (data) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to={`/customer/${data?.id}/view`}>
            <RiEyeLine size={20} className="cursor-pointer" />
          </Link>
          {/* <button>
            <RiEditLine size={20} onClick={() => handleEditCustomer(data)} />
          </button> */}
        </div>
      ),
    },
  ];

  const columns: TableProps<any>['columns'] = tableActions;

  const breadcrumbItems = [
    { title: 'Dashboard', url: '/' },
    { title: 'Customers' },
  ];

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
          setDataSortOrder={setSortOrder}
          value={sortBy}
        />
      ),
      key: '1',
    },
  ];

  const onSelectionButtons: OnSelectionButton[] = [
    {
      title: 'Set as Active',
      actionType: 'function',
      action: () => {
        handleStatusChange(ids, 1);
      },
      isDefault: true,
    },
    {
      title: 'Set as Inactive',
      actionType: 'function',
      action: () => {
        handleStatusChange(ids, 0);
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
      <BreadcrumbHeader pageTitle="Customers" breadcrumbItems={breadcrumbItems}>
        {/* {customers?.data.length > 0 && (
          <ButtonComponent
            href="/customers/add"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Create Customer
          </ButtonComponent>
        )} */}
      </BreadcrumbHeader>

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={columns}
        dataSource={customers?.data || []}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
            buttonLink="/customers/create"
          />
        }
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        totalData={customers?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setFilterStatus={setFilterStatus}
        loading={isFetching}
        leftHeaderComponent={
          <div className="flex gap-2">
            <Button
              type={filterStatus === 'All' ? 'primary' : 'text'}
              onClick={() => setFilterStatus('All')}
            >
              All
            </Button>
            <Button
              type={filterStatus === 'Active' ? 'primary' : 'text'}
              onClick={() => setFilterStatus('Active')}
            >
              Active
            </Button>
            <Button
              type={filterStatus === 'Inactive' ? 'primary' : 'text'}
              onClick={() => setFilterStatus('Inactive')}
            >
              Inactive
            </Button>
          </div>
        }
      />
    </>
  );
};

export default CustomerList;
