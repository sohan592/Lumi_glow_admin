import BreadcrumbHeader from '@/@components/layouts/breadcrumb';
import { RiArrowUpLine, RiDeleteBinLine, RiReplyLine } from '@remixicon/react';
import type { MenuProps, TableProps } from 'antd';
import { Alert, Button, Modal, Rate, Row, Spin, notification } from 'antd';
import { lazy, useState } from 'react';

import {
  useBulkReviewStatusChangeMutation,
  useDeleteReviewsMutation,
  useGetReviewsQuery,
} from '@/modules/appstore/review/reviewApi';
import {
  generateNestedQueryString,
  generateQueryString,
  getStatusNumber,
} from '@/modules/helpers/utils';
import moment from 'moment';
import ReviewFallback from './components/ReviewFallback';
import ReplyForm from './components/reply';

const TableComponent = lazy(() => import('@/@components/table/TableComponent'));

const breadcrumbItems = [{ title: 'Dashboard', url: '/' }, { title: 'Review' }];

export default function ReviewList() {
  const [ids, setIds] = useState<Array<number>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<any>();
  const [sortOrder, setSortOrder] = useState<string | undefined>('DESC');
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

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
        orderBy: 'id',
        order: sortOrder,
      },
    ],
  });
  // Fetch reviews
  const {
    data: reviews,
    isError,
    isLoading,
    isFetching,
  } = useGetReviewsQuery(queryParam);

  // Bulk action mutation
  const [bulkStatusChange] = useBulkReviewStatusChangeMutation();
  const [deleteReviews] = useDeleteReviewsMutation();

  const handleDeleteBrand = (id: number[]) => {
    const payload = { ids: id };
    const queryString = generateQueryString(payload);

    try {
      deleteReviews(queryString);
      notification.success({ message: 'Review deleted successfully!' });
      setIds([]);
    } catch (error) {
      notification.error({
        message: 'Failed to delete review',
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

  const openReplyModal = (data: any) => {
    setReviewData(data);
    setIsModalOpen(true);
  };

  const sortDropdown: MenuProps['items'] = [
    {
      label: 'Sort By',
      key: '0',
    },

    {
      label: (
        <Row
          align="middle"
          onClick={() => {
            setSortOrder('ASC');
          }}
        >
          <RiArrowUpLine size={18} />
          <span>Created ASC</span>
        </Row>
      ),
      key: '2',
    },
  ];

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Author',
      dataIndex: 'author',
      width: 200,
      render: (_, record) => (
        <div>
          <p className="font-semibold">
            {record?.user.firstName?.toUpperCase()}{' '}
            {record?.user.lastName?.toUpperCase()}
          </p>
          <p>{record?.user.email}</p>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      render: (n) => <Rate disabled value={n} />,
      width: 160,
    },
    {
      title: 'Review',
      dataIndex: 'comment',
      key: 'comment',
      width: 500,
      render: (_, record) => (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">{record.comment}</p>
          {record.adminReply && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold mb-1">Admin Reply:</p>
              <p className="text-gray-600 text-sm">{record.adminReply}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {record?.status?.name === 'ACTIVE' ? (
              <button
                type="button"
                onClick={() => {
                  Modal.confirm({
                    title: 'Unapprove Review',
                    content: 'Are you sure you want to unapprove this review?',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => handleStatusChange([record?.id], 2),
                  });
                }}
                className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md"
              >
                Unapprove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  Modal.confirm({
                    title: 'Approve Review',
                    content: 'Are you sure you want to approve this review?',
                    okText: 'Yes',
                    okType: 'default',
                    cancelText: 'No',
                    onOk: () => handleStatusChange([record?.id], 1),
                  });
                }}
                className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-md"
              >
                Approve
              </button>
            )}

            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              onClick={() => openReplyModal(record)}
            >
              <RiReplyLine className="w-3.5 h-3.5" />
              Reply
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              onClick={() => {
                if (record?.status?.name === 'DELETED') {
                  return notification.error({
                    message: 'Review already deleted!',
                  });
                }
                Modal.confirm({
                  title: 'Delete Review',
                  content: 'Are you sure you want to delete this review?',
                  okText: 'Yes',
                  okType: 'danger',
                  cancelText: 'No',
                  onOk: () => handleDeleteBrand([record?.id]),
                });
              }}
            >
              <RiDeleteBinLine className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      width: 300,
      render: (product) => (
        <div>
          <p>{product.name}</p>
        </div>
      ),
    },
    {
      title: 'Submitted On',
      dataIndex: 'createdAt',
      render: (date) => moment(date).format('DD MMM YYYY'),
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
      <BreadcrumbHeader pageTitle="Review" breadcrumbItems={breadcrumbItems} />
      <TableComponent
        setSearchKeyword={setKeyword}
        dropdownItems={sortDropdown}
        columns={columns}
        dataSource={reviews?.data || []}
        fallbackComponent={<ReviewFallback />}
        selectedItems={ids}
        setSelectedItems={setIds}
        totalData={reviews?.total || 0}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loading={isFetching}
        setFilterStatus={setFilterStatus}
        leftHeaderComponent={
          <div className="flex gap-2">
            <Button
              type={filterStatus === 'All' ? 'primary' : 'default'}
              onClick={() => setFilterStatus('All')}
              className="min-w-[80px]"
            >
              All
            </Button>
            <Button
              type={filterStatus === 'Active' ? 'primary' : 'default'}
              onClick={() => setFilterStatus('Active')}
              className={`min-w-[80px] ${
                filterStatus !== 'Active'
                  ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                  : ''
              }`}
            >
              <span className="flex items-center justify-center">Approved</span>
            </Button>
            <Button
              type={filterStatus === 'Inactive' ? 'primary' : 'default'}
              onClick={() => setFilterStatus('Inactive')}
              className={`min-w-[80px] ${
                filterStatus !== 'Inactive'
                  ? 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100'
                  : ''
              }`}
            >
              <span className="flex items-center justify-center">
                Unapproved
              </span>
            </Button>
          </div>
        }
      />
      <Modal
        title={`Reply to ${reviewData?.user?.firstName} ${reviewData?.user?.lastName}`}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <ReplyForm reviewData={reviewData} setIsModalOpen={setIsModalOpen} />
      </Modal>
    </>
  );
}
