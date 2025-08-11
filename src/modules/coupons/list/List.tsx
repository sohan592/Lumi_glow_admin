import ButtonComponent from '@/@components/form/button';
import CustomRadio from '@/@components/form/radio';
import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { OnSelectionButton } from '@/@components/table/TableComponent';
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
  useBulkCouponStatusChangeMutation,
} from '@/modules/appstore/coupon/couponApi';
import {
  generateNestedQueryString,
  generateQueryString,
  getSortByCoupon,
  getStatusNumber,
} from '@/modules/helpers/utils';
import sortDropDownData from '@/modules/coupons/list/sort-dropdown.json';

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
import NoData from '@/modules/product/components/NoData';
import { useNavigate } from 'react-router-dom';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const breadcrumbItems = [
  { title: 'Dashboard', url: '/' },
  { title: 'Coupons' },
];

export default function CouponList() {
  const [ids, setIds] = useState<number[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setDataSortOrder] = useState<string | undefined>('DESC');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const queryParam = generateNestedQueryString({
    page: currentPage,
    limit: 10,
    filters: {
      campaignName: keyword,
      status:
        filterStatus && filterStatus !== 'All'
          ? [{ id: getStatusNumber(filterStatus) }]
          : undefined,
    },

    sort: [
      {
        orderBy: getSortByCoupon(sortBy) ?? 'id',
        order: sortOrder,
      },
    ],
  });

  const {
    data: couponsData,
    isError,
    isLoading,

    isFetching,
  } = useGetCouponsQuery(queryParam);
  const [deleteCoupons] = useDeleteCouponMutation();
  const [bulkStatusChange] = useBulkCouponStatusChangeMutation();

  const handleEditCoupon = (data: any) => {
    navigate(`edit/${data?.id}`);
  };

  const handleDeleteCoupons = (id: number[]) => {
    const payload = { ids: id };
    const queryString = generateQueryString(payload);

    try {
      deleteCoupons(queryString);
      notification.success({ message: 'Coupon deleted successfully!' });
      setIds([]);
    } catch (error) {
      notification.error({
        message: 'Failed to delete Coupon',
        description: (error as any).message,
      });
    }
  };

  const handleStatusChange = async (id: number[], status: number) => {
    const payload = { ids: id, statusId: status };
    const queryString = generateQueryString(payload);

    try {
      await bulkStatusChange(queryString);
      notification.success({ message: 'Status changed successfully!' });
      setIds([]);
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
      title: 'ID',
      dataIndex: 'id',
    },

    {
      title: 'CAMPAIGN NAME',
      dataIndex: 'campaignName',
      render: (text) => text?.toString().toUpperCase(),
    },

    {
      title: 'CODE',
      dataIndex: 'code',
      render: (text) => text?.toString().toUpperCase(),
    },
    {
      title: 'DISCOUNT',
      dataIndex: 'discountValue',
      render: (text) => text?.toString().toUpperCase(),
    },
    {
      title: 'START DATE',
      dataIndex: 'startDate',
      render: (date) =>
        new Date(date)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          .toUpperCase(),
    },
    {
      title: 'END DATE',
      dataIndex: 'endDate',
      render: (date) =>
        new Date(date)
          .toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          .toUpperCase(),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      render: (status) => {
        const statusText = status?.name?.toUpperCase() || 'UNKNOWN';
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
              statusText === 'ACTIVE'
                ? 'bg-green-50 text-green-700 ring-green-600/20'
                : statusText === 'DRAFT'
                  ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                  : 'bg-red-50 text-red-700 ring-red-600/20'
            }`}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      title: 'ACTION',
      dataIndex: '',
      key: 'actions',
      render: (data) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleEditCoupon(data)}>
            <RiEditLine size={20} />
          </button>
          <button onClick={() => handleDeleteCoupons([data?.id])}>
            <RiDeleteBinLine size={20} />
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
        handleDeleteCoupons(ids);
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
      <BreadcrumbHeader pageTitle="Coupons" breadcrumbItems={breadcrumbItems}>
        {couponsData?.data?.length > 0 && (
          <ButtonComponent
            href="/coupon/add"
            type="primary"
            borderRadius="4px"
            icon={<PlusOutlined />}
          >
            Create Coupon
          </ButtonComponent>
        )}
      </BreadcrumbHeader>

      <TableComponent
        setSearchKeyword={setKeyword}
        selectedItems={ids}
        setSelectedItems={setIds}
        columns={[...tableActions]}
        dataSource={couponsData?.data || []}
        dropdownItems={sortDropdown}
        onSelectionButtons={onSelectionButtons}
        setFilterStatus={setFilterStatus}
        fallbackComponent={
          <NoData
            title="No Data Found"
            description="There are no items to display at this time."
            buttonLink="/coupons/add"
          />
        }
        totalData={couponsData?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        // leftHeaderComponent={<LeftSideHeader setFilters={setFilterStatus} />}
        loading={isFetching}
      />
    </>
  );
}
