import { RiEditLine } from '@remixicon/react';
import { Alert, Button, message, Spin, TableProps } from 'antd';
import { useEffect, useState } from 'react';

import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import TableComponent from '@/@components/table/TableComponent';
import { useGetShippingMethodsQuery } from '@/modules/appstore/shipping/shippingApi';

import { generateNestedQueryString } from '@/modules/helpers/utils';
import NoData from '@/modules/product/components/NoData';
import tableColumnsListData from '@/modules/shipping/list/table-columns.json';
import { useNavigate } from 'react-router-dom';
import { ShipingDataType } from './types';

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Shipping Methods' },
];

export default function ShippingList() {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryParamGet = generateNestedQueryString({
    page: currentPage,
    limit: 10,
    filters: {
      displayName: keyword,
    },

    sort: [
      {
        orderBy: 'id',
        order: 'DESC',
      },
    ],
  });

  // Fetch shipping methods using the API hook
  const {
    data: shippingMethods,
    isError,
    isLoading,
    isFetching,
  } = useGetShippingMethodsQuery(queryParamGet);

  useEffect(() => {
    if (isError) {
      message.error('Failed to fetch shipping methods');
    }
  }, [isError]);
  const navigate = useNavigate();

  const handleEditShipping = (data: { id: number }) => {
    navigate(`edit/${data?.id}`);
  };

  // const handleDelete = (id: number) => {
  //   const payload = { ids: id };
  //   const queryString = generateQueryString(payload);
  //   deleteShippingMethod(queryString)
  //     .then(() => {
  //       message.success('Shipping method deleted successfully');
  //       refetch();
  //     })
  //     .catch((error) => {
  //       message.error('Failed to delete shipping method');
  //       console.error(error);
  //     });
  // };

  const tableActions: TableProps<ShipingDataType>['columns'] = [
    {
      title: 'Action',
      dataIndex: '',
      key: 'actions',
      render: (data) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button>
            <RiEditLine size={20} onClick={() => handleEditShipping(data)} />
          </button>
          {/* <button>
            <RiDeleteBinLine
              size={20}
              onClick={() => {
                Modal.confirm({
                  title: 'Delete Media',
                  content: 'Are you sure you want to delete this brand?',
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => handleDelete(data?.id),
                });
              }}
            />
          </button> */}
        </div>
      ),
    },
  ];

  const columns: TableProps<ShipingDataType>['columns'] = [
    ...tableColumnsListData,
    ...tableActions,
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
      <BreadcrumbHeader
        pageTitle="Shipping Methods"
        breadcrumbItems={breadcrumbItems}
      />
      {/* <ButtonComponent
          href="/shipping-methods/add"
          type="primary"
          borderRadius="4px"
          icon={<PlusOutlined />}
        >
          Create Method
        </ButtonComponent> */}

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={columns}
        dataSource={shippingMethods?.data || []}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
          />
        }
        totalData={shippingMethods?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loading={isFetching}
        leftHeaderComponent={<Button>All</Button>}
      />
    </>
  );
}
